import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repository, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem(
            '@GithubExplorer:repositories',
        );

        if(storageRepositories){
            return JSON.parse(storageRepositories);
        } else {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            '@GithubExplorer:repositories',
            JSON.stringify(repositories),
        );
    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if(!newRepo){
            setInputError('Repository name is required');
            return;
        }

        try{
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([ ...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch (err){
            setInputError('Error while searching for this repository.');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore a repository on Github.</Title> 

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input 
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Repository's name. Ex: facebook/react" 
                />
                <button type="submit">Search</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repository>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img 
                            src={repository.owner.avatar_url}
                            alt={repository.full_name}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repository>
        </>  
    );
}


export default Dashboard;