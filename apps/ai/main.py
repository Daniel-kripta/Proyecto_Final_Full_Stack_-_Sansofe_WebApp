from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException

from agent import crear_agente
from models import ChatRequest, ChatResponse, TestKeyRequest
from security import validate_query

app = FastAPI()
agente = crear_agente()


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/test-key")
async def test_key(body: TestKeyRequest):
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import HumanMessage
        test_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=body.gemini_api_key,
            max_output_tokens=1,
            temperature=0,
        )
        test_llm.invoke([HumanMessage(content="1")])
        return {"ok": True}
    except Exception:
        return {"ok": False}


@app.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    try:
        query = validate_query(body.query)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        resultado = agente.invoke(
            {
                "query": query,
                "k": body.k,
                "umbral": body.umbral,
                "gemini_api_key": body.gemini_api_key,
                "messages": [],
                "tipo_consulta": "",
                "consulta_extraida": {},
                "articulos_recuperados": [],
                "respuesta": {},
            },
            config={"configurable": {"thread_id": body.session_id}},
        )
        return resultado["respuesta"]
    except Exception as e:
        msg = str(e)
        if "RESOURCE_EXHAUSTED" in msg or "429" in msg:
            return {
                "type": "irrelevante",
                "content": "Se ha agotado la cuota de la API de Gemini. Puedes introducir otra clave en Ajustes o esperar a que se recarguen los usos gratuitos.",
                "sources": [],
            }
        raise
