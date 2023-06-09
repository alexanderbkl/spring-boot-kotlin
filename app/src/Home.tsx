import { useEffect, useState } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { User } from './types';

const Home = () => {

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User>();
    const [cookies] = useCookies(['XSRF-TOKEN']);

    useEffect(() => {
        setLoading(true);
        fetch('api/user', { credentials: 'include' })
            .then(response => response.text())
            .then(body => {
                if (body === '') {
                    setAuthenticated(false);
                } else {
                    setUser(JSON.parse(body));
                    setAuthenticated(true);
                }
                setLoading(false);
            });
    }, [setAuthenticated, setLoading, setUser])

    const login = () => {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
            port = ':8080';
        }
        // redirect to a protected URL to trigger authentication
        window.location.href = `//${window.location.hostname}${port}/api/private`;
    }

    const logout = () => {
        fetch('/api/logout', {
            method: 'POST', credentials: 'include',
            headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] }
        })
            .then(res => res.json())
            .then(response => {
                window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
                    + `&post_logout_redirect_uri=${window.location.origin}`;
            });
    }

    const message = user ?
        <h2>Bienvenido, {user.name}!</h2> :
        <p>Bienvenido a TaskTogether.</p>;

    const button = authenticated ?
        <div>
            <Button className='m-2' color="success" tag={Link} to="/users">Ver usuarios</Button>
            <br />
            <Button  className='m-2' color="success" tag={Link} to="/groups">Gestionar grupos</Button>
            <br />
            <Button color="link" onClick={logout}>Logout</Button>
        </div> :
        <>
        <p>Para comenzar, por favor, inicia sesión.</p>
        <Button color="primary" onClick={login}>Login</Button>
        </>;

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                {message}
                {button}
            </Container>
        </div>
    );
}

export default Home;