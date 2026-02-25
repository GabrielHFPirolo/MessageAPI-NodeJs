import { getToken } from "./auth.js"

const API_URL = 'http://localhost:3333'

window.addEventListener('DOMContentLoaded', () => {
    const token = getToken()

    if (!token) {
        window.location.href = '/'
        return
    }

    carregarAtividade()
})

//Funções Assíncronas
async function carregarAtividade() {
    const res = await fetch(`${API_URL}/admin/atividade`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })

    if (!res.ok) {
        console.error("Erro ao buscar atividade")
        return 
    }

    const data = await res.json()

    const totalIniciados = somarValores(data.iniciados_por_usuario)
    const totalFinalizados = somarValores(data.finalizados_por_usuario)
    const totalAndamento = somarValores(data.em_andamento_por_usuario)

    document.getElementById('card-tempo').innerHTML = `
        <h3>Tempo Médio de Conclusão</h3>
        <p>${formatarTempo(data.tempo_medio_conclusao_ms)}</p>
    `

    document.getElementById('card-total-iniciados').innerHTML = `
        <h3>Total Iniciados</h3>
        <p>${totalIniciados}</p>
    `

    document.getElementById('card-total-finalizados').innerHTML = `
        <h3>Total Finalizados</h3>
        <p>${totalFinalizados}</p>
    `

    renderLista('lista-iniciados', data.iniciados_por_usuario)
    renderLista('lista-finalizados', data.finalizados_por_usuario)
    renderLista('lista-andamento', data.em_andamento_por_usuario)

    renderTabela(data.recentes)

    renderGrafico(totalIniciados, totalFinalizados, totalAndamento)
}

function renderGrafico(iniciados, finalizados, andamento) {
    const ctx = document.getElementById('graficoAtendimentos')

    if (!ctx) return

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Iniciados', 'Finalizados', 'Em Andamento'],
            datasets: [{
                data: [iniciados, finalizados, andamento],
                borderRadius: 8
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    })
}

function renderLista (elementId, objeto) {
    const ul = document.getElementById(elementId)
    ul.innerHTML = ''

    for (const user in objeto) {
        const li = document.createElement('li')
        li.textContent = `${user}: ${objeto[user]}`
        ul.appendChild(li)
    }
}

function somarValores (obj) {
    return Object.values(obj).reduce((acc, val) => acc + val, 0)
}

function formatarTempo(ms) {
    if (!ms) return 'N/A'

    const minutos = Math.floor(ms/60000)
    const horas = Math.floor(minutos/60)

    return `${horas}h ${minutos % 60}min`
}

function formatarData(data) {
    if (!data) return '-'
    return new Date(data).toLocaleString('pt-BR')
}

function calcularTempo(inicio, fim) {
    if (!inicio || !fim) return '-'

    const diff = new Date(fim) - new Date(inicio)
    const minutos = Math.floor(diff/60000)

    return `${minutos} min`
}

function renderTabela(lista) {
    const tbody = document.getElementById('admin-table-body')
    tbody.innerHTML = ''

    lista.forEach(at => {
        const protocolo = `AT-${at.id.toString().padStart(4, '0')}`
        const tr = document.createElement('tr')
        const tempo = calcularTempo(at.iniciado_em, at.concluido_em)

        tr.innerHTML = `
            <td>${protocolo}</td>
            <td>${at.iniciado_user?.username || '-'}</td>
            <td>${formatarStatus(at.status)}</td>
            <td>${formatarData(at.iniciado_em)}</td>
            <td>${formatarData(at.concluido_em)}</td>
            <td>${tempo}</td>
        `

        tbody.appendChild(tr)
    })
}

function formatarStatus(status) {

    const classes = {
        iniciado: 'status-iniciado',
        andamento: 'status-andamento',
        finalizado: 'status-finalizado'
    }

    const classe = classes[status] || ''
    return `<span class="status ${classe}">${status}</span>`
}