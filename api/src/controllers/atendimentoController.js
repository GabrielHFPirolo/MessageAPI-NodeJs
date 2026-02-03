import { supabase } from "../database/supabase.js"

class AtendimentoController {
    // Função para Create - POST
    async create(req, res){
        const {nome, cpf, cidade, desejo, telefone} = req.body
        
        const {data, error} = await supabase
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
        let query = supabase.from('Atendimentos').select('*')
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

            const { data, error} = await supabase
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

export default new AtendimentoController()