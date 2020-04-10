<template>
    <div>
        <button @click='logout'>Logout</button>
        <h1> Welcome again </h1>
        <h2> {{ name }} </h2>
        <h2> you are registered with this email: {{ email }} </h2>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Landing',
    data (){
        return  {
            name: '',
            email: ''
        }
    },
    created(){
        //user is not authorized
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login');
        }
    },

    mounted() {
        axios.get('http://localhost:5000/user', { headers: { token: localStorage.getItem('token')}})
        .then( res => { 
            this.name = res.data.user.name;
            this.email = res.data.user.email;
        })
    },
    
    methods: {
        logout(){
            localStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>