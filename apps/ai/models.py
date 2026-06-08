from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str
    session_id: str


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
