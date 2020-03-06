Vue.component('listquery', {
    props: {
        value: String,
        index: Number,
        editstatus: Boolean,
        state: String,
        sorttype: String,
        sorttype2: String,
        boolstate: Boolean,
    },
    template: `
    <li class="todo" :id="index" v-if="state==sorttype || state==sorttype2">
        <div class="view">
            <input v-if="editstatus=false" @blur="vm.$data.tasksList[index].state = false; $emit('update')" @keyup.enter = "">
            <div v-else>
                <input type="checkbox" v-model="boolstate"" :id="'#' + index" class="toggle" @click="updateState">
                <label :class="{'completed': boolstate===true}">{{value}}</label>
            </div>
            <button class="destroy" @click="destroyElem"></button>
        </div>
        <!-- <input type="text" class="edit"> -->
    </li>
    `,
    methods: {
        destroyElem() {
            this.$emit('destroyelem')
        },        
        updateState() {
            this.$emit('updatestate')
        },        
        editStat() {
            this.$emit('editstat')
        },
    }
})


const vm =  new Vue ({
    el:"#todos",
    data: {
        tasksList:[],
        showQuery:[],
        nbElem:0,
        nbToDo:0,
        nbDone:0,
        sortType:['todo', 'done'],
        indexSort:0,
        toggle:false,
    },
    methods: {
        doAdd: function (e) {
            if(e.target.value != "") {
                var index = this.nbElem
                this.tasksList.push({'index' : index, 'value' : e.target.value, 'state' : 'todo', 'cr_state' : false, 'edit' : false})
                this.showQuery.push(true)
                this.nbElem++
                this.nbToDo++
                e.target.value = ""
                console.log(this.tasksList)
            }
          },
          doDestroy: function(e, state) {
                if(state == 'todo') {
                    this.nbToDo--
                }              
                var posDel = this.tasksList.indexOf(e)
                console.log("dest")
                this.tasksList.splice(posDel, 1)
          },
          showAll: function() {
            for(var i=0;i<this.tasksList.length;i++) {
                this.showQuery[i] = true
            }
            this.sortType[0] = 'todo'
            this.sortType[1] = 'done'
            console.log(this.sortType)
            document.getElementById('all').classList.add("selected")
            document.getElementById('todo').classList.remove("selected")
            document.getElementById('done').classList.remove("selected")
            vm.$forceUpdate();
          },          
          showToDo: function() {
            for (var i=0;i<this.tasksList.length;i++) {
                this.showQuery[i] = true
                if(this.tasksList[i].state == 'done') {
                    this.showQuery[i] = false
                }
              }
            this.sortType[0] = 'todo'
            this.sortType[1] = ''
            vm.$forceUpdate();
            document.getElementById('all').classList.remove("selected")
            document.getElementById('done').classList.remove("selected")
            document.getElementById('todo').classList.add("selected")

          },
          showDone: function() {
            for (var i=0;i<this.tasksList.length;i++) {
                this.showQuery[i] = true
                if(this.tasksList[i].state == 'todo') {
                    this.showQuery[i] = false
                }
            }
            this.sortType[0] = 'done'
            this.sortType[1] = ''
            vm.$forceUpdate();
            document.getElementById('all').classList.remove("selected")
            document.getElementById('todo').classList.remove("selected")
            document.getElementById('done').classList.add("selected")
          },
          doUpdate: function (query, state, id) {
            var index = (this.tasksList.indexOf(query))
            if(state == 'todo') {
                this.tasksList[index].state = 'done'
                this.tasksList[index].cr_state = true
                document.getElementById(id).classList.add("completed")
                this.nbDone++
                this.nbToDo--
            }
            else if(state=='done') {
                this.tasksList[index].state = 'todo'
                this.tasksList[index].cr_state = false
                document.getElementById(id).classList.remove("completed")
                this.nbDone--
                this.nbToDo++
            }
          },
          clearAll: function () {
            for(var i=0;i<this.tasksList.length;i++) {
                if(this.tasksList[i].state == 'done') {
                    console.log(i)
                    this.tasksList.splice(i, 1)
                    this.nbDone--
                    this.nbElem--
                    i--
                }          
            }
          },
          toggleAll: function () {
            if(!this.toggle) {
                this.toggle=true
                for(var i=0;i<this.tasksList.length;i++) {
                    if(this.tasksList[i].state == 'todo') {
                        this.tasksList[i].state = 'done'
                        document.getElementById(i).classList.add("completed")
                        document.getElementById("#" + i).checked = true;
                        this.nbDone++
                        this.nbToDo--
                    }
                }
            }
            else {
                this.toggle=false
                for(var i=0;i<this.tasksList.length;i++) {
                    if(this.tasksList[i].state == 'done') {
                        this.tasksList[i].state = 'todo'
                        document.getElementById(i).classList.remove("completed")
                        document.getElementById("#" + i).checked = false;
                        this.nbDone--
                        this.nbToDo++
                    }
                }
            }
          }
    },
    computed: {
        updateList: function() {
            return this.showQuery
        },
        updateType: function() {
            return this.sortType
        },
        updateStateSelect: function() {
            var result = []
            for(var i=0;i<this.tasksList.length;i++) {
                result[i] = this.tasksList[i].cr_state
            }
            console.log(result)
            return result
        }
    }
})