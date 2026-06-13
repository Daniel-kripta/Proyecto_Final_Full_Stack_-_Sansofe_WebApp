from pydantic import BaseModel, Field


class TestKeyRequest(BaseModel):
    gemini_api_key: str


class ChatRequest(BaseModel):
    query: str
    session_id: str
    k: int = Field(default=10, ge=1, le=50)
    umbral: str | None = None
    gemini_api_key: str | None = None
    coleccion_id: str | None = None
    articulo_ids: list[str] | None = None


class ArticuloRef(BaseModel):
    id: str
    headline: str
    date: str
    publication: str
    url: str


class ChatResponse(BaseModel):
    type: str
    content: str
    sources: list[ArticuloRef]
