import { supabaseService } from "../database/supabase.js"
import { mapAnexo } from "../models/Atendimento.js"

class AtendimentoController {
    // Função para Create - POST
    async create(req, res){
        const {nome, cpf, cidade, desejo, telefone} = req.body
        
        const {data, error} = await supabaseService
        .from('Atendimentos')
        .insert([{
            nome,
            cpf,
            cidade,
            desejo,
            telefone,
            status: 'novo'
        }])
        .select()
        .single()

        if (error){
            return res.status(400).json({error: error.message})
        }

        return res.status(201).json({
            ...data,
            whatsappUrl: `https://wa.me/${telefone}`
        })
    }

    // Função Listagem - GET
    async list(req, res){
        const {status} = req.query
        let query = supabaseService.from('Atendimentos').select('*')
        if (status) query = query.eq('status', status)
        const {data, error} = await query.order('created_at', {ascending: false})
        
        if (error){
            return res.status(400).json({error: error.message})
        }

        return res.json(data)
    }

    // Função Update - PATCH
    async update(req, res){
        try {
            const {id} = req.params
            const {status} = req.body

            if (!id) {
                return res.status(400).json({ error: 'ID não informado' })
            }

            const { data, error} = await supabaseService
            .from('Atendimentos')
            .update({status})
            .eq('id', id)
            .select()
            .single()

            if (error){
                return res.status(400).json({error: error.message})
            }

            return res.status(200).json(data)
        }
        catch (err){
            console.error(err)
            return res.status(500).json({error: 'Erro interno de Servidor'})
        }
    }
}

export async function listarAnexos(req, res) {
    const { id } = req.params

    if (isNaN(id)) {
        return res.status(400).json({error: 'ID inválido'})
    }

    try {
        const {data, error} = await supabaseService
        .from('Atendimentos')
        .select(`
            *,
            anexos_atendimento (
                id,
                atendimento_id,
                tipo,
                url,
                created_at,
                nome
            )
        `)
        .eq('id', id)
        .single()

        if (error){
            throw error
        }

        const anexos = (data.anexos_atendimento || []).map(mapAnexo)

        return res.status(200).json(anexos)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: 'Erro ao buscar anexos'})
    }
}

export default new AtendimentoController()