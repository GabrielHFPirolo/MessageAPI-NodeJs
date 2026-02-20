import { getToken, login } from "./auth.js"

const API_URL = 'http://localhost:3333/atendimento'

// Declaração Variáveis escopo global
let atendimentoSelecionado = null
let cardSelecionado = null
let atendimentosCache = []
let cidadeSelecionada = 'todas'
let searchAtual = ''
let timeoutBusca
let atendimentoNotaAtual = null

//Funções Normais de suporte

function Logged() {
    return !!getToken()
}

function logout() {
    if (!confirm('Deseja sair?')) return
    localStorage.removeItem('token')
    location.reload()
}

function showApp() {
    document.getElementById('app').style.display = 'block'
    document.getElementById('login-box').style.display = 'none'
}

function showLogin() {
    document.getElementById('app').style.display = 'none'
    document.getElementById('login-box').style.display = 'flex'
}

//Modal - Confirmação para conclusão de atendimento
function abrirModal(id, card) {
  atendimentoSelecionado = id
  cardSelecionado = card
  document.getElementById('modal-confirmacao').classList.remove('hidden')
}

//Modal - Desabilitar modal
function fecharModal() {
  document.getElementById('modal-confirmacao').classList.add('hidden')
  atendimentoSelecionado = null
  cardSelecionado = null
}

function abrirModalNotas(id) {
    atendimentoNotaAtual = id
    document.getElementById('modal-notas').classList.remove('hidden')
    document.getElementById('modal-notas').classList.add('ativo')
    carregarNotas(id)
}

function fecharModalNotas() {
    document.getElementById('modal-notas').classList.remove('ativo')
    document.getElementById('modal-notas').classList.add('hidden')
}

// Toast - Notificação confirmando atendimento finalizado
function mostrarToast() {
  const toast = document.getElementById('toast')
  toast.classList.remove('hidden')
  toast.classList.add('show')

  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.classList.add('hidden'), 300)
  }, 2500)
}

// Formatação de data pra exibição dinâmica
function formatarData(timestamp) {
  const data = new Date(timestamp)

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = String(data.getFullYear()).slice(-2)

  const horas = String(data.getHours()).padStart(2, '0')
  const minutos = String(data.getMinutes()).padStart(2, '0')

  return `${dia}-${mes}-${ano} || ${horas}:${minutos}`
}

//Atualização de Badges de notificação de quantidade de atendimentos dependendo da seleção
function AtualizarBadges() {
    document.querySelectorAll('.city-btn').forEach(btn => {
        const cidade = btn.dataset.cidade

        const badgeExistente = btn.querySelector('.badge')
        if(badgeExistente) badgeExistente.remove()

        let count = 0

        if (cidade === 'todas') {
            count = atendimentosCache.filter(a => a.status === 'novo').length
        } else {
            count = atendimentosCache.filter(a =>
                a.status === 'novo' &&
                a.cidade &&
                a.cidade.trim() === cidade
            ).length
        }

        if(count > 0){
            const badge = document.createElement('span')
            badge.className = 'badge'
            badge.textContent = count > 9 ? '9+' : count
            btn.appendChild(badge)
        }
    })
}

//Renderização principal de cards - status - novo
function renderizarCards() {
    const container = document.getElementById('cards-container')
    container.innerHTML = ''

    atendimentosCache
    .filter(a => a.status !== 'finalizado')
    .filter(a => cidadeSelecionada === 'todas' || a.cidade === cidadeSelecionada)
    .forEach(a => {
        const card = document.createElement('div')
        card.className = 'card'

        if(a.status === 'em_atendimento') {
            card.classList.add('em_atendimento')    
        }

        const numero = a.telefone.replace(/\D/g, '')
        const whatsappUrl = `https://wa.me/${numero}`

        //Estrutura principal HTML dos cards
        card.innerHTML = `
            <h3>${a.nome}</h3>
            <p><strong>CPF:</strong> ${a.cpf}</p>
            <p><strong>Desejo:</strong> ${a.desejo}</p>
            <p><strong>Status:</strong> <span class="status">${a.status}</span></p>
            <p class="timestamp">
            <strong>Recebido: </strong> ${formatarData(a.created_at)}</p>            
            <div class="anexos" id="anexos-${a.id}">
                <span class="anexos-loading">Carregando Anexos...</span>
            </div>

            <div class="actions"></div>
        `
        const actions = card.querySelector('.actions')

        const btnWhatsapp = document.createElement('button')
        btnWhatsapp.className = 'btn btn-whatsapp'
        btnWhatsapp.textContent = 'Whatsapp'
        btnWhatsapp.addEventListener('click', () => {
            AtendimentoIniciado(a.id, card, whatsappUrl)
        })

        const btnConcluido = document.createElement('button')
        btnConcluido.className = 'btn btn-status'
        btnConcluido.textContent = 'Concluído'
        btnConcluido.addEventListener('click', () => {
            abrirModal(a.id, card)
        })

        const btnNotas = document.createElement('button')
        btnNotas.className = 'btn btn-notas'
        btnNotas.textContent = 'Notas'
        btnNotas.addEventListener('click', () => {
            abrirModalNotas(a.id)
        })

        actions.appendChild(btnWhatsapp)
        actions.appendChild(btnConcluido)
        actions.appendChild(btnNotas)

        container.appendChild(card)
        buscarAnexos(a.id)
    })
}

//Requisição para carregamento dos Cards
async function carregarAtendimentos(){
    const params = new URLSearchParams()

    if (searchAtual && searchAtual.trim() !== '') {
        params.append('search', searchAtual.trim())
    }

    const url = params.toString()
    ? `${API_URL}?${params.toString()}`
    : API_URL

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    const data = await res.json()

    if (!res.ok) {
        console.error('Erro ao carregar atendimentos:', data)

        if (res.status === 401) {
            alert('Sessão expirada, faça login novamente')
            logout()
            return
        }

        atendimentosCache = []
        return
    }

    atendimentosCache = data    
    renderizarCards()
    AtualizarBadges()
}

// Atualização de status caso o atendimento for ser finalizado
async function AtualizarStatus(){
    const res = await fetch(`${API_URL}/${atendimentoSelecionado}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({status: 'finalizado'})
    })
    cardSelecionado.remove()

    if (!res.ok) {
        alert('Erro ao atualizar atendimento')
        return
    }
    carregarAtendimentos()
}

//Puxar lógica do botão de whatsapp com a mudança de status e estilo
async function AtendimentoIniciado(id, cardElement, whatsappUrl){
    try{
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({status: 'em_atendimento'})
        })

        cardElement.classList.add('em_atendimento')

        const statusEl = cardElement.querySelector('p strong + span')
        if (statusEl) statusEl.textContent = 'em_atendimento'

        window.open(whatsappUrl, '_blank')
    }
    catch (err){
        console.error('Erro ao iniciar atendimento', err)
        alert('Erro ao iniciar atendimento')
    }
    carregarAtendimentos()
}

async function buscarAnexos(atendimentoId) {
    try {
        const res = await fetch(`${API_URL}/${atendimentoId}/anexos`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
        if (!res.ok) return

        const anexos = await res.json()

        renderizarAnexos(atendimentoId, anexos)
    }
    catch {
        console.error('Erro ao buscar anexos', err)
    }
}

async function carregarNotas(id) {
    const res = await fetch(`${API_URL}/${id}/notas`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })

    if(!res.ok) {
        console.error("Erro ao buscar notas")
        return
    }

    const notas = await res.json()

    if (!Array.isArray(notas)) {
        console.error("Resposta Inesperada:", notas)
        return
    }

    const container = document.getElementById('lista-notas')
    container.innerHTML = ''

    notas.forEach(n => {
        const div = document.createElement('div')
        div.className = 'nota-item'

        div.innerHTML =`
            <p>${n.nota}</p>
            <small>
            ${n.users?.username || 'Usuário indefinido'} • ${formatarData(n.created_at)}
            </small>
        `
        container.appendChild(div)
    })
}

document.getElementById('salvar-nota')
.addEventListener('click', async () => {
    const texto = document.getElementById('nova-nota').value

    if (!texto.trim()) return

    await fetch(`${API_URL}/${atendimentoNotaAtual}/notas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({nota: texto})
    })

    document.getElementById('nova-nota').value = ''
    carregarNotas(atendimentoNotaAtual)
})

function renderizarAnexos(atendimentoId, anexos){
    const container = document.getElementById(`anexos-${atendimentoId}`)

  if (!container) return

  container.innerHTML = ''

  if (anexos.length === 0) {
    container.innerHTML = '<span class="sem-anexo">Sem anexos</span>'
    return
  }

  anexos.forEach(a => {
    const item = document.createElement('div')
    item.className = 'anexo-item'

    // Analizar possibilidade de esconder esse URL
    item.innerHTML = `
      <span class="anexo-tipo">${a.tipo}</span>
      <span class="anexo-nome">${a.nome || 'Arquivo'}</span>
      <a href="https://pgtikznhzorwfnnlqhpd.supabase.co/storage/v1/object/public/Files_Application/${a.atendimento_id}/${a.nome}" 
      target="_blank" class="anexo-link" rel="noopener noreferrer">
        Abrir
      </a>
    `

    container.appendChild(item)
  })
}

//Ações fora de escopo de funções
//Ação de mudança dos botões referentes às cidades
document.querySelectorAll('.city-btn').forEach(btn => {
    btn.addEventListener('click', () =>{
        document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        cidadeSelecionada = btn.dataset.cidade
        renderizarCards()
    })
})

//Ação referente ao botão confirmar do Modal
document.getElementById('btn-confirmar')
.addEventListener('click', async() => {
    await AtualizarStatus()
    fecharModal()
    mostrarToast()
})

//Ação referente ao botão cancelar do Modal
document.getElementById('btn-cancelar')
.addEventListener('click', fecharModal)

document.getElementById('logoutBtn')
    ?.addEventListener('click', logout)

window.AtualizarStatus = AtualizarStatus

document.getElementById('loginBtn')?.addEventListener('click', async () => {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
        await login(username, password)
        location.reload()
    }
    catch (err){
        alert(err.message)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    if (!Logged()) {
        showLogin()
        return
    }

    showApp()
    carregarAtendimentos()
})

document.getElementById('input-search')?.addEventListener('input', (e) => {
    clearTimeout(timeoutBusca)

    timeoutBusca = setTimeout(() => {
        searchAtual = e.target.value
        carregarAtendimentos()
    }, 300)
})

document.addEventListener('DOMContentLoaded', () => {
    const btnFechar = document.getElementById('fechar-nota')

    if(btnFechar) {
        btnFechar.addEventListener('click', fecharModalNotas)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'))

    if(user?.role === 'admin') {
        document.getElementById('btn-admin').style.display = 'block'
    }
})

const btnAdmin = document.getElementById('btn-admin')

if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
        window.location.href = '/admin.html'
    })
}