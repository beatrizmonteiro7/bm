import { Button, Grid2, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import NewCompany from '../new';

export default function ListCompany() {    
    const [stateListagem, setStateListagem] = useState({
        abrirPopUp: false,
    })

    const empresaSelecionada: any = useRef()

    const [data, setData] = useState([
        {
          id: 1,
          cnpj: '65625172000104',
          nome: 'Nome',
          nomeFantasia: 'Nome Fantasia',
          cep: '11111111',
          logradouro: 'Logradouro',
          bairro: 'Bairro',
          cidade: 'Cidade',
          uf: 'UF',
          complemento: 'Complemento',
          email: 'E-mail',
          telefone: 'Telefone',
          actions: null
        },
    ])

    const updateMockData = (newData: any) => {
        setData(newData)
    }
    
    const removeData: any = (id: number) => {
        const updateData = data.filter(item => item.id !== id)
        setData(updateData)
    }

    const columns = [
        { field: 'id', headerName: 'id', width: 1, editable: false },
        { field: 'cnpj', headerName: 'CNPJ', width: 250, editable: false },
        { field: 'nomeFantasia', headerName: 'Nome Fantasia', width: 250, editable: false },
        { field: 'cep', headerName: 'CEP', width: 200, editable: false },
        { field: 'cidade', headerName: 'Cidade', width: 200, editable: false },
        { field: 'actions',
            headerName: 'Actions',
            width: 0,
            cellClassName: 'actions',
            renderCell: (params: any) => {
                const data = params.row;
                return (
                    (
                        <>
                            <IconButton onClick={() => {
                                removeData(data.id)
                            }}>
                                <FontAwesomeIcon color='red' icon={faTrash} />
                            </IconButton>
        
                            <IconButton onClick={() => {
                                setStateListagem((prev) => ({
                                    ...prev,
                                    abrirPopUp: true,
                                }))
                                empresaSelecionada.current?.editarEmpresaSelecionada({
                                        id: data.id,
                                        cnpj: {
                                            value: data.cnpj,
                                            error: false
                                        },
                                        nome: data.nome,
                                        nomeFantasia: data.nomeFantasia,
                                        cep: {
                                            value: data.cep,
                                            error: false
                                        },
                                        logradouro: data.logradouro,
                                        bairro: data.bairro,
                                        cidade: data.cidade,
                                        uf: data.uf,
                                        complemento: data.complemento,
                                        email: data.email,
                                        telefone: data.telefone
                                })
                            }}>
                                <FontAwesomeIcon color='orange' icon={faPencil} />
                            </IconButton>
                        </>
                      )
                )
            }
        }
    ]

    return (
        <>
            <Grid2 container>
                <Grid2 size={12} justifyContent={'end'} display={'flex'}>
                    <Button
                        sx={{
                            display: 'flex',
                            mb: '10px'
                        }} 
                        variant='contained'
                        onClick={() => {
                        setStateListagem((prev) => ({
                            ...prev,
                            abrirPopUp: true
                        }))
                    }}>
                        Cadastro
                    </Button>
                </Grid2>
            </Grid2>

            <NewCompany 
                open={stateListagem.abrirPopUp}
                closed={() => {
                    setStateListagem((prev) => ({
                        ...prev,
                        abrirPopUp: false
                    }))
                }}
                mockData={data}
                updateMockData={updateMockData}
                ref={empresaSelecionada}
            />

            <DataGrid rows={data} columns={columns} />
        </>
    )
}