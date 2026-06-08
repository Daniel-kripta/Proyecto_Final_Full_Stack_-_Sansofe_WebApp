MAX_QUERY_LENGTH = 500


def validate_query(query: str) -> str:
    query = query.strip()
    if not query:
        raise ValueError("La consulta no puede estar vacía")
    if len(query) > MAX_QUERY_LENGTH:
        raise ValueError(f"La consulta no puede superar {MAX_QUERY_LENGTH} caracteres")
    return query
