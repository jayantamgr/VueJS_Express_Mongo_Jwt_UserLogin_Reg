<template>
    <div>
        NAME: <input type="text" v-model="name" /> <br/>
        <br/>
        EMAIL: <input type="email" required v-model="email" /> <br/>
        <br/>
        PASSWORD: <input type="password" required v-model="password" /> <br/>
        <button @click="signup">Signup</button>
        <br/>
        <p> {{ error }} </p>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name:'Signup',
    data(){
    return {
            name: '',
            email: '',
            password: '',

            error: '',
        }
    },
    methods: {
        signup() {
            let newUser = {
                name: this.name,
                email: this.email,
                password: this.password
            }
            axios.post('http://localhost:5000/signup', newUser)
            .then(res => {
                console.log(res)
                this.error = '';
                this.$router.push('/login');
            }, err => {
                console.log(err.response)
                this.error = err.response.data.error 
            })
        }
    }
}

</script>
