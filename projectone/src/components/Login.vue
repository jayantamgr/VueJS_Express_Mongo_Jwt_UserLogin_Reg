<template>
    <div>
        EMAIL: <input type="email" required v-model="email" /> <br/>
        <br/>
        PASSWORD: <input type="password" required v-model="password" /> <br/>
        <button @click="login">Login</button>
        <br/>
        <p> {{ error }} </p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    methods: {
        login(){
            let user = {
                email: this.email,
                password: this.password,
            }
            axios.post('http://localhost:5000/login', user)
            .then(res => {
                if (res.status === 200) {
                    console.log(res)
                    localStorage.setItem('token', res.data.token);
                    this.error = '';
                    this.$router.push('/');
                }
               // console.log(res);
                
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error
            })
        }
    }
}
</script>