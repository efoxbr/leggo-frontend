<template>
  <div>
    <el-row justify="center">
        <div>
          <ul class="progressbar">
              <li v-for="(fase, i) in sortedFases" :key="i" :class="styleFase(fase, i)"/>
          </ul>
        </div>
    </el-row>
    <el-row type="flex" justify="space-around" style="text-align: center">
        <el-col :span="6">
          <el-button :disabled="this.selectedFase == 0"
                    round
                    class="el-icon-arrow-left"
                    size="mini"
                    @click="selectedFase--"></el-button>
        </el-col>
        <el-col :span="10" :style="{ 'text-align': 'center' }">
           {{ sortedFases[selectedFase].local }} - {{ sortedFases[selectedFase].fase_global }}
        </el-col>
        <el-col :span="6">
          <el-button :disabled="this.selectedFase == this.sortedFases.length - 1"
            round
            class="el-icon-arrow-right"
            size="mini"
            @click="selectedFase++"></el-button>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  name: 'FasesProgress',
  props: {
    fases: Array
  },
  data () {
    return {
      selectedFase: 0
    }
  },
  mounted () {
    this.selectedFase = this.indexOfFaseAtual
  },
  methods: {
    styleFase (fase, i) {
      return {
        'active': this.isFinished(fase),
        'future': this.isFuture(fase),
        'jumped': this.isJumpedFase(fase),
        'inProgress': this.isInProgress(fase),
        'senado': fase.local_casa === 'senado',
        'camara': fase.local_casa === 'camara',
        'planalto': fase.local_casa === 'presidência da república' || fase.local_casa === 'congresso',
        'selectedFase': i === this.selectedFase
      }
    },
    isInProgress (fase) {
      const now = Date.now()
      return (fase.data_inicio != null && fase.data_fim == null) || new Date(fase.data_fim) > now
    },

    isFinished (fase) {
      const now = Date.now()
      return fase.data_fim != null && new Date(fase.data_fim) < now
    },

    isJumpedFase (fase) {
      return fase.pulou
    },

    isFuture (fase) {
      return fase.data_fim == null && fase.data_inicio == null && !this.isJumpedFase(fase)
    }
  },
  computed: {
    sortedFases () {
      let sortOrder = { 'Comissões - Construção': '1',
        'Plenário - Construção': '2',
        'Comissões - Revisão I': '3',
        'Plenário - Revisão I': '4',
        'Comissões - Revisão II': '5',
        'Plenário - Revisão II': '6',
        'Presidência da República - Sansão/Veto': '7',
        'Congresso - Avaliação dos Vetos': '8' }
      return this.fases.slice().sort((a, b) => {
        let indexA = a.local + ' - ' + a.fase_global
        let indexB = b.local + ' - ' + b.fase_global
        return (sortOrder[indexA] - sortOrder[indexB])
      })
    },
    indexOfFaseAtual () {
      const fases = this.sortedFases
      let result = 0
      while (result !== fases.length) {
        if (this.isFuture(fases[result])) {
          break
        }
        result++
      }
      return --result
    }
  }
}
</script>

<style lang="scss" scoped>
  .progressbar {
      counter-reset: step;
      padding: 0;
  }
  .progressbar li {
      list-style-type: none;
      width: 12%;
      float: left;
      font-size: 12px;
      position: relative;
      text-align: center;
      text-transform: uppercase;
      color: black;
  }
  // --- os before fazem as linhas, e os after os circulo ---

  .progressbar li:before {
      width: 30px;
      height: 30px;
      content: '';
      position: relative;
      counter-increment: step;
      display: block;
      margin: 0 auto 10px auto;
      background-position: left;
      background-size: cover;
      transition: transform .2s;
      border-style: solid;
      border-width: 1px;
      border-color: white;
      border-radius: 50%;
  }

  .progressbar li:after { //linha
      width: 100%;
      height: 2px;
      content: '';
      position: absolute;
      background-color: #DC6060;
      top: 15px;
      left: -50%;
      z-index: -1;
  }
  .progressbar li:first-child:after {
      content: none;
  }
  .camara:before {
    background-image: url('../../../assets/camara.png');
    background-position: left;
    background-size: cover;
  }
  .senado:before {
    background-image: url('../../../assets/senado.png');
  }

  .future:before {
    opacity: 0.5;
    filter: alpha(opacity=50);
  }

  .planalto:before {
    background-image: url('../../../assets/planalto.png');
  }

  .jumped:before {
    background-image: url('../../../assets/vazio.png');
  }
  .selectedFase::before {
    transform: scale(1.7);
    z-index: 1;
  }

</style>