import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import PopUp from "../../components/PopUp";
import { Button, Grid2, TextField } from "@mui/material";
import { schema } from "../types/schema";
import clearData from "../../utils/clearData";

interface INewCompanyProps {
    open: boolean;
    closed: () => void;
    mockData: any;
    updateMockData: (value: any) => void;
}

export type RefNovaEmpresa = {
    editarEmpresaSelecionada: (dadosEmpresa: {
        id: string;
        cnpj: {
            value: string;
            error: boolean;
        },
        nome: string;
        nomeFantasia: string;
        cep: {
            value: string;
            error: boolean;
        },
        logradouro: string;
        bairro: string;
        cidade: string;
        uf: string;
        complemento: string;
        email: string;
        telefone: string;
    }) => void;
}
const newCompany = forwardRef(function NewCompany(props: INewCompanyProps, ref: React.ForwardedRef<RefNovaEmpresa>) {
    //Estados, dados que seram preenchidos pelo usuário e enviados para o back-end
    const [states, setStates] = useState({
        cnpj: {
            value: '',
            error: false
        },
        nome: '',
        nomeFantasia: '',
        cep: {
            value: '',
            error: false
        },
        logradouro:'',
        bairro: '',
        cidade: '',
        uf: '',
        complemento: '',
        email: '',
        telefone: ''
    })

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    
    const edicao = 
    
    console.log(props.mockData);
    
    
    //Função para limpar os Estados, caso o usuário feche o modal
    function clearFields() {
        setStates((prev) => ({
            ...prev,
            cnpj: {
                value: '',
                error: false,
            },
            nome: '',
            nomeFantasia: '',
            cep: {
                value: '',
                error: false
            },
            logradouro:'',
            bairro: '',
            cidade: '',
            uf: '',
            complemento: '',
            email: '',
            telefone: ''
        }))
    }

    //Função para pegar as informações do CNPJ
    async function getCNPJ() {
        if (states.cnpj.value.length !== 14) {
            return;
        }
    
        try {
            const response = await fetch(`https://publica.cnpj.ws/cnpj/${states.cnpj.value}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            
            setStates((prev) => ({
                ...prev,
                nomeFantasia: data.estabelecimento?.nomeFantasia || '',
                logradouro: data.estabelecimento?.logradouro || '',
                bairro: data.estabelecimento.bairro || '',
                cidade: data.estabelecimento.cidade.nome || '',
                uf: data.estabelecimento.estado.sigla || '',
                complemento: data.estabelecimento?.complemento || '',
                email: data.estabelecimento.email || '',
                telefone: data.estabelecimento.telefone1 ? data.estabelecimento.telefone1 :  data.estabelecimento.telefone2 
            }));
        } catch (error) {
            console.error('Error fetching CNPJ data:', error);
        }
    }

    //Função para pegar as informações do CEP
    async function getCEP() {
        if (states.cep.value.length !== 8) {
            return;
        }
    
        try {
            const resultado = await fetch(`https://viacep.com.br/ws/${states.cep.value}/json/`, {
                headers: {
                    Accept: 'application/json, text/plain, */*'
                }
            });
    
            if (!resultado.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await resultado.json();
            
            setStates((prev) => ({
                ...prev,
                cep: {
                    value: data.cep || '',
                    error: false
                },
                logradouro: data?.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                uf: data.uf || '',
                complemento: data.complemento || '',
            }));
        } catch (error) {
            console.error('Error fetching CEP data:', error);
        }
    }

    //Função para enviar os dados para o back-end
    async function handleSubmit() {
        try {
            const formData = states;
            
            // Se a validação for bem-sucedida, envie os dados para o backend
            const  sendData = schema.parse(formData);

            if(isEditMode && editId !== null) {
                const updatedMockData = props.mockData.map(item => 
                    item.id === editId ? { ...item, ...sendData } : item
                );
    
                // Atualiza os dados no componente pai
                const cleanedData = clearData(updatedMockData);
                props.updateMockData(cleanedData);
            } else {
                 // Se não estiver em modo de edição, cria um novo item
                 const newItem = { ...sendData, id: Math.floor(Math.random() * 1000) + 1 };
                 const updatedMockData = [...props.mockData, newItem];

                 // Limpa os dados do formulário
                 const cleanedData = clearData(updatedMockData);
                 props.updateMockData(cleanedData);
            }
            props.closed()
            clearFields()
        } catch (error) {
            console.log('Mapeando erro do parse (schema): ', error);
        }
    }    

    useEffect(() => {
        if (states.cnpj.value.length === 14) {
            getCNPJ();
        }
    }, [states.cnpj.value]);
    
    useEffect(() => {
        if (states.cep.value?.length === 8) {
            getCEP();
        }
    }, [states.cep.value]);    

    useImperativeHandle(ref, () => {
        return {
            editarEmpresaSelecionada: (dadosEmpresa: {
                id: any;
                cnpj: {
                    value: string;
                    error: boolean;
                },
                nome: string;
                nomeFantasia: string;
                cep: {
                    value: string;
                    error: boolean;
                },
                logradouro: string;
                bairro: string;
                cidade: string;
                uf: string;
                complemento: string;
                email: string;
                telefone: string;
            }) => {                
                setStates((prev) => ({
                    ...prev,
                    id: dadosEmpresa.id,
                    cnpj: {
                        value: dadosEmpresa.cnpj.value,
                        error: false,
                    },
                    nome: dadosEmpresa.nome,
                    nomeFantasia: dadosEmpresa.nomeFantasia,
                    cep: {
                        value: dadosEmpresa.cep.value,
                        error: false
                    },
                    logradouro: dadosEmpresa.logradouro,
                    bairro: dadosEmpresa.bairro,
                    cidade: dadosEmpresa.cidade,
                    uf: dadosEmpresa.uf,
                    complemento: dadosEmpresa.complemento,
                    email: dadosEmpresa.email,
                    telefone: dadosEmpresa.telefone
                }))
                setIsEditMode(true);
                setEditId(dadosEmpresa.id);
            }
        }
    })
    
    return (
        <>
            <PopUp
                open={props.open}
                onClose={() => {
                    props.closed()
                    clearFields()
                }}
                title="Cadastrar Nova Empresa"
            >
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <TextField 
                            label="CNPJ" 
                            variant="outlined"
                            value={states.cnpj.value}
                            error={states.cnpj.error}
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    maxLength: 14
                                }
                            }}
                            onChange={(event) => {
                               setStates((prev) => ({
                                ...prev,
                                cnpj: {
                                    value: event.target.value,
                                    error: false
                                }
                               }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="Nome" 
                            variant="outlined"
                            value={states.nome}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    nome: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField
                            label="Nome Fantasia" 
                            variant="outlined"
                            value={states.nomeFantasia}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    nomeFantasia: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="CEP" 
                            variant="outlined"
                            value={states.cep.value}
                            error={states.cep.error}
                            slotProps={{ htmlInput: {
                                maxLength: 8
                            }}}
                            fullWidth
                            onChange={(event) => {
                            setStates((previousValue) => ({
                                ...previousValue, 
                                cep: {
                                    value: event.target.value,
                                    error: false
                                }
                            }))
                            
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="Logradouro" 
                            variant="outlined"
                            value={states.logradouro}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    logradouro: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="Bairro" 
                            variant="outlined"
                            value={states.bairro}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    bairro: event.target.value
                                }))
                            }}
                    />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="Cidade" 
                            variant="outlined"
                            value={states.cidade}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    cidade: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="UF" 
                            variant="outlined"
                            value={states.uf}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    uf: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField 
                            label="Complemento" 
                            variant="outlined"
                            value={states.complemento}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    complemento: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField
                            label="Email" 
                            variant="outlined"
                            value={states.email}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    email: event.target.value
                                }))
                            }}
                        />
                    </Grid2>

                    <Grid2 size={6}>
                        <TextField  
                            label="Telefone" 
                            variant="outlined"
                            value={states.telefone}
                            fullWidth
                            onChange={(event) => {
                                setStates((previousValue) => ({
                                    ...previousValue,
                                    telefone: event.target.value
                                }))
                            }}
                        />
                    </Grid2>
                </Grid2>

                <Grid2 container>
                    <Button 
                        sx={{ 
                            alignItems: 'end',  
                            justifyContent: 'flex-end', 
                            display: 'flex'
                        }} 
                        variant="contained"
                        size="small"
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        Enviar
                    </Button>
                </Grid2>
            </PopUp>
        </>
    )
})

export default newCompany