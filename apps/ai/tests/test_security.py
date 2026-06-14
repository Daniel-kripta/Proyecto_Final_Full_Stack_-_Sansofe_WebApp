import pytest
from security import validate_query


def test_consulta_valida():
    result = validate_query("  ¿Qué ocurrió en Las Palmas en 1926?  ")
    assert result == "¿Qué ocurrió en Las Palmas en 1926?"


def test_consulta_vacia_lanza_error():
    with pytest.raises(ValueError, match="vacía"):
        validate_query("")


def test_consulta_solo_espacios_lanza_error():
    with pytest.raises(ValueError, match="vacía"):
        validate_query("   ")


def test_consulta_exactamente_500_caracteres():
    consulta = "a" * 500
    result = validate_query(consulta)
    assert len(result) == 500


def test_consulta_de_501_caracteres_lanza_error():
    with pytest.raises(ValueError, match="500"):
        validate_query("a" * 501)


def test_strip_elimina_espacios_extremos():
    result = validate_query("\n  texto  \n")
    assert result == "texto"
