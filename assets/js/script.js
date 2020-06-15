const vm = new Vue({
    el: "#app",
    data: {
        keyword: '',
        pokemons: [],
        sidebar: true,
        offset: 3,
        limit: 3,
        info: false,
        loading: false,
        load_percent: '',
        infos: [],
        maxstatus: '',
        specie: {},
        description: ''
    },
    computed: {
        filteredPokemons() {
            return this.pokemons.filter(post => {
                return post.name.toLowerCase().includes(this.keyword.toLowerCase())
            })
        }
    },
    methods: {
        getPokemons() {
            this.pokemons = [];
            let pokemonList = [];
            try {
                axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${this.limit}&offset=${this.offset}`)
                    .then(res => {
                        pokemonList = res.data.results;

                        pokemonList.forEach(poke => {
                            axios.get(poke.url).then(res => {
                                this.pokemons.push(res.data);
                            });
                        });
                    });
            } catch (error) {
                console.log(error);
            }
        },
        sortPokemons() {
            if (this.pokemons) {
                if (this.pokemons.slice().length != this.limit) {
                    this.loading = true;
                    this.load_percent = Math.trunc((this.pokemons.slice().length * 100) / this.limit);
                } else {
                    this.loading = false;
                }
                return this.pokemons.slice().sort(function (a, b) {
                    return a.id > b.id ? 1 : -1;
                });
            } else {
                return null;
            }
        },
        selectContinent(gen) {
            switch (gen) {
                case 1:
                    this.offset = 0;
                    this.limit = 151;
                    break;
                case 2:
                    this.offset = 151;
                    this.limit = 100;
                    break;
                case 3:
                    this.offset = 251;
                    this.limit = 135;
                    break;
                case 4:
                    this.offset = 386;
                    this.limit = 107;
                    break;
                case 5:
                    this.offset = 493;
                    this.limit = 156;
                    break;
                case 6:
                    this.offset = 649;
                    this.limit = 72;
                    break;
                case 7:
                    this.offset = 721;
                    this.limit = 86;
                    break;
                    //case 8: this.offset = 809; this.limit = 85; break;
                default:
                    /* Nothing */
            }
            this.keyword = "";
            this.getPokemons();
        },
        getInfo(poke) {
            this.getDescription(poke);
            this.infos = poke;
            this.info = true;
            this.maxstatus = 0;
            poke.stats.forEach(e => {
                if (e.base_stat > this.maxstatus) this.maxstatus = e.base_stat + 5;
            });
        },
        getDescription(poke) {
            axios.get(`https://pokeapi.co/api/v2/pokemon-species/${poke.id}`).then(r => {
                this.specie = r.data;
                this.description = String(this.specie.flavor_text_entries[0].flavor_text).replace(/[^A-Za-z.,; ]/g, ' ');
            });
        },
        setNumber(number) {
            if (number < 10) {
                return "00" + number;
            } else if (number < 100) {
                return "0" + number;
            } else {
                return number;
            }
        }
    },
    mounted() {
        this.getPokemons();
    }
});