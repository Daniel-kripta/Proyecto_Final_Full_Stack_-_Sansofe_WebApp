import pytest
from unittest.mock import patch, MagicMock
import main as _main_module


PAYLOAD_BASE = {
    "query": "¿Qué pasó en Las Palmas?",
    "session_id": "test-session",
    "k": 5,
}


def test_chat_consulta_vacia_devuelve_400(client):
    res = client.post("/chat", json={**PAYLOAD_BASE, "query": "   "})
    assert res.status_code == 400


def test_chat_consulta_demasiado_larga_devuelve_400(client):
    res = client.post("/chat", json={**PAYLOAD_BASE, "query": "a" * 501})
    assert res.status_code == 400


def test_chat_llama_al_agente(client):
    _main_module.agente.invoke.return_value = {
        "respuesta": {
            "type": "lista",
            "content": "Encontré artículos",
            "sources": [],
        }
    }

    res = client.post("/chat", json=PAYLOAD_BASE)

    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "lista"
    assert _main_module.agente.invoke.called


def test_chat_devuelve_estructura_correcta(client):
    _main_module.agente.invoke.return_value = {
        "respuesta": {
            "type": "sintesis",
            "content": "Síntesis del período",
            "sources": [
                {
                    "id": "art-1",
                    "headline": "Titular",
                    "date": "1926-01-01",
                    "publication": "El Día",
                    "url": "/articulo/art-1",
                }
            ],
        }
    }

    res = client.post("/chat", json=PAYLOAD_BASE)

    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "sintesis"
    assert len(data["sources"]) == 1
    assert data["sources"][0]["id"] == "art-1"


def test_chat_maneja_cuota_agotada(client):
    _main_module.agente.invoke.side_effect = Exception("RESOURCE_EXHAUSTED: quota exceeded")

    res = client.post("/chat", json=PAYLOAD_BASE)

    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "irrelevante"
    assert "cuota" in data["content"].lower()


def test_chat_con_coleccion_id_usa_sintetizador(client):
    with patch("main._sintetizar_coleccion") as mock_sint:
        mock_sint.return_value = {
            "type": "sintesis",
            "content": "Síntesis de colección",
            "sources": [],
        }

        res = client.post("/chat", json={**PAYLOAD_BASE, "coleccion_id": "col-uuid-1"})

        assert res.status_code == 200
        assert mock_sint.called
        assert _main_module.agente.invoke.not_called


def test_chat_con_articulo_ids_usa_sintetizador(client):
    with patch("main._sintetizar_articulos") as mock_sint:
        mock_sint.return_value = {
            "type": "sintesis",
            "content": "Síntesis de artículos",
            "sources": [],
        }

        res = client.post("/chat", json={**PAYLOAD_BASE, "articulo_ids": ["art-1", "art-2"]})

        assert res.status_code == 200
        assert mock_sint.called
