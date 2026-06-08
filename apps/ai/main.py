from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException

from agent import crear_agente
from models import ChatRequest, ChatResponse
from security import validate_query

app = FastAPI()
agente = crear_agente()


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    try:
        query = validate_query(body.query)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    resultado = agente.invoke(
        {
            "query": query,
            "messages": [],
            "tipo_consulta": "",
            "articulos_recuperados": [],
            "respuesta": {},
        },
        config={"configurable": {"thread_id": body.session_id}},
    )
    return resultado["respuesta"]
