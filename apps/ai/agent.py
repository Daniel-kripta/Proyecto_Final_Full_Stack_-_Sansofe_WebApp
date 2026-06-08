import operator
from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph

from vectorstore import similarity_search

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)


class EstadoRAG(TypedDict):
    query: str
    k: int
    messages: Annotated[list[BaseMessage], operator.add]
    tipo_consulta: str
    articulos_recuperados: list
    respuesta: dict


def nodo_router(estado: EstadoRAG) -> dict:
    respuesta = llm.invoke([HumanMessage(content=f"""
Clasifica esta consulta de investigación histórica.
Responde ÚNICAMENTE con "lista" o "sintesis".

- "lista": buscar artículos concretos ("artículos sobre X", "noticias de Y")
- "sintesis": entender un tema ("qué se decía sobre X", "cómo se informó de Y")

Consulta: {estado['query']}
""")])
    tipo = respuesta.content.strip().lower()
    return {"tipo_consulta": tipo if tipo in ("lista", "sintesis") else "lista"}


def nodo_recuperar(estado: EstadoRAG) -> dict:
    articulos = similarity_search(estado["query"], k=estado["k"])
    return {"articulos_recuperados": articulos}


def nodo_lista(estado: EstadoRAG) -> dict:
    arts = estado["articulos_recuperados"]
    return {
        "respuesta": {
            "type": "lista",
            "content": f"Encontré {len(arts)} artículos relevantes:",
            "sources": [
                {
                    "id": a["id"],
                    "headline": a["headline"],
                    "date": a["date"],
                    "publication": a["publication"],
                    "url": a["url"],
                }
                for a in arts
            ],
        }
    }


def nodo_sintesis(estado: EstadoRAG) -> dict:
    arts = estado["articulos_recuperados"]
    contexto = "\n\n---\n\n".join(
        f"[{a['publication']}, {a['date']}]\n{a['headline']}\n{a['body'][:600]}"
        for a in arts
    )

    respuesta = llm.invoke([HumanMessage(content=f"""
Eres un historiador especializado en Canarias en 1926.
Responde la consulta usando ÚNICAMENTE los artículos del [CONTEXTO].
Cita las fuentes indicando publicación y fecha. Escribe en español.
Si el contexto no contiene información suficiente, dilo explícitamente.

[CONTEXTO]
{contexto}

[CONSULTA]
{estado['query']}
""")])

    return {
        "respuesta": {
            "type": "sintesis",
            "content": respuesta.content,
            "sources": [
                {
                    "id": a["id"],
                    "headline": a["headline"],
                    "date": a["date"],
                    "publication": a["publication"],
                    "url": a["url"],
                }
                for a in arts[:5]
            ],
        }
    }


def crear_agente():
    g = StateGraph(EstadoRAG)

    g.add_node("router", nodo_router)
    g.add_node("recuperar", nodo_recuperar)
    g.add_node("lista", nodo_lista)
    g.add_node("sintesis", nodo_sintesis)

    g.set_entry_point("router")
    g.add_edge("router", "recuperar")
    g.add_conditional_edges(
        "recuperar",
        lambda s: s["tipo_consulta"],
        {"lista": "lista", "sintesis": "sintesis"},
    )
    g.add_edge("lista", END)
    g.add_edge("sintesis", END)

    return g.compile(checkpointer=MemorySaver())
