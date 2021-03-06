import Vue from 'vue'
import Vapi from 'vuex-rest-api'
import filterStore from './filter'
import temps from './temperaturas'
import pautas from './pautas'

const proposicoes = new Vapi({
  baseURL: process.env.VUE_APP_API_URL,
  state: {
    proposicoes: [],
    tramitacoes: new Set(),
    // pautas: {},
    eventos_tramitacao: {},
    metaInfo: {}
  }
}).get({
  action: 'listProposicoes',
  property: 'proposicoes',
  path: ({ semanas, date }) =>
    `proposicoes?semanas_anteriores=${semanas}&data_referencia=${date}`,
  onSuccess: (state, { data }) => {
    state.proposicoes = data
    var temperaturas = {}
    var coeficientes = {}
    var pautasTmp = {}
    data.forEach((prop) => {
      // TODO: por enquanto usa apenas a última etapa
      prop.lastEtapa = prop.etapas.slice(-1)[0]
      temperaturas[prop.lastEtapa.id] = prop.lastEtapa.temperatura_historico
      coeficientes[prop.lastEtapa.id] = prop.lastEtapa.temperatura_coeficiente
      pautasTmp[prop.lastEtapa.id] = prop.lastEtapa.pauta_historico
    })
    Vue.set(temps.state, 'temperaturas', temperaturas)
    Vue.set(temps.state, 'coeficiente', coeficientes)
    Vue.set(pautas.state, 'pautas', pautasTmp)
  }
}).get({
  action: 'getMetaInfo',
  path: '/info',
  property: 'metaInfo'
}).getStore()

proposicoes.getters = {
  perFilterOptions (state) {
    // Retorna um obj com todas as opções de valores para cada filtro, baseado
    // nos dados das proposições
    let options = {}
    for (let filter of filterStore.state.filters) {
      // O Set aqui é usado para deixar só os valores distintos
      options[filter] = [...new Set(
        // Pega, em cada proposição, o valor do atributo ao qual o filtro se refere
        state.proposicoes.map(p => p.lastEtapa[filter])
      ).values()]
    }
    return options
  },
  createfilterOptionObjectEmpty (state) {
    let options = {}
    filterStore.state.filters.map(filter => { options[filter] = [] })
    return options
  },
  getPropById (state) {
    return (id) => state.proposicoes.find(prop => prop.id === id)
  }
}

export default proposicoes
