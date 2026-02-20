import { supabaseService } from "../database/supabase.js";

class adminController {
    async atividade (req, res) {
        try {
            const { data, error } = await supabaseService
            .from('Atendimentos')
            .select(`
                iniciado_por,
                concluido_por,
                iniciado_em,
                concluido_em,
                status,
                iniciado_user: iniciado_por ( username ),
                concluido_user: concluido_por ( username )    
            `)

            if (error) {
                return res.status(400).json({error: error.message})
            }

            const iniciados = {}
            const finalizados = {}
            const emAndamento = {}

            let totalTempoConclusao = 0
            let totalConcluidosComTempo = 0

            data.forEach(at => {
                if (at.iniciado_user?.username) {
                    const username = at.iniciado_user.username
                    iniciados[username] = (iniciados[username] || 0) + 1
                }

                if (at.concluido_user?.username) {
                    const username = at.concluido_user.username
                    finalizados[username] = (finalizados[username] || 0) + 1
                }

                if (at.status === 'em_atendimento' && at.iniciado_user?.username) {
                    const username = at.iniciado_user.username

                    emAndamento[username] =
                        (emAndamento[username] || 0) + 1
                }

                if (at.iniciado_em && at.concluido_em) {
                    const inicio = new Date(at.iniciado_em)
                    const fim = new Date(at.concluido_em)
                    totalTempoConclusao += (fim - inicio)
                    totalConcluidosComTempo++
                }
            })

            const tempoMedioMs = 
                totalConcluidosComTempo > 0
                    ? totalTempoConclusao / totalConcluidosComTempo
                    : 0

            res.json({
                iniciados_por_usuario: iniciados,
                finalizados_por_usuario: finalizados,
                em_andamento_por_usuario: emAndamento,
                tempo_medio_conclusao_ms: tempoMedioMs
            })
        }
        catch (err){
            console.error(err)
            return res.status(500).json({error: 'Erro interno do servidor'})
        }
    }
}

export default new adminController()