import sys
from unittest.mock import MagicMock, patch

# Sustituye el agente antes de que main.py lo inicialice
mock_agente = MagicMock()

with patch("agent.crear_agente", return_value=mock_agente):
    import main as _main_module

import pytest
from starlette.testclient import TestClient


@pytest.fixture(scope="session")
def client():
    return TestClient(_main_module.app)


@pytest.fixture(autouse=True)
def reset_agente():
    _main_module.agente = mock_agente
    mock_agente.reset_mock()
    yield
