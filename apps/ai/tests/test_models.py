import pytest
from pydantic import ValidationError
from models import ChatRequest, TestKeyRequest, ChatResponse, ArticuloRef


def test_chat_request_valores_por_defecto():
    req = ChatRequest(query="test", session_id="sess-1")
    assert req.k == 10
    assert req.umbral is None
    assert req.gemini_api_key is None
    assert req.coleccion_id is None
    assert req.articulo_ids is None


def test_chat_request_k_minimo():
    req = ChatRequest(query="test", session_id="s", k=1)
    assert req.k == 1


def test_chat_request_k_maximo():
    req = ChatRequest(query="test", session_id="s", k=50)
    assert req.k == 50


def test_chat_request_k_fuera_de_rango_lanza_error():
    with pytest.raises(ValidationError):
        ChatRequest(query="test", session_id="s", k=0)

    with pytest.raises(ValidationError):
        ChatRequest(query="test", session_id="s", k=51)


def test_chat_request_con_coleccion_id():
    req = ChatRequest(query="test", session_id="s", coleccion_id="col-uuid-1")
    assert req.coleccion_id == "col-uuid-1"


def test_chat_request_con_articulo_ids():
    req = ChatRequest(query="test", session_id="s", articulo_ids=["art-1", "art-2"])
    assert req.articulo_ids == ["art-1", "art-2"]


def test_test_key_request_requiere_api_key():
    with pytest.raises(ValidationError):
        TestKeyRequest()

    req = TestKeyRequest(gemini_api_key="mi-clave")
    assert req.gemini_api_key == "mi-clave"


def test_chat_response_valida():
    resp = ChatResponse(
        type="lista",
        content="Encontré artículos",
        sources=[
            ArticuloRef(id="a1", headline="Titular", date="1926-01-01", publication="El Día", url="/articulo/a1")
        ],
    )
    assert resp.type == "lista"
    assert len(resp.sources) == 1
