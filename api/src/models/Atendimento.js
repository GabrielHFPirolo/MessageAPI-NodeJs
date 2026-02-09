export function mapAnexo(row) {
    return {
        id: row.id,
        atendimento_id: row.atendimento_id,
        tipo: row.tipo,
        nome: row.nome,
        url: row.url,
        createdAt: row.created_at
    }
}