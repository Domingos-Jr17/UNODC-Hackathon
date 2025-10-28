import {Button} from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
export const Header = () => {
     const navigate = useNavigate(); 

    const handleActivateUser = () => {
    navigate("/active")
        
        
    };

    const handleGenerateReport = () => {
      
        alert('Função de geração de relatório - em desenvolvimento');
    };

  return (
    <header className="flex justify-between w-full bg-blue-800 h-20">
        <div className=" bg-[url('/public/logo.png')] bg-cover bg-center bg-no-repeat w-20 h-18 m-1"></div>
        <div className="flex flex-wrap gap-2 mt-5 mr-5 ">
                    <Button className="bg-white text-black" onClick={handleGenerateReport}>
                        Gerar Relatório
                    </Button>

                    <Button className="bg-white text-black" onClick={handleActivateUser}>
                        Ativar Novo Usuário
                    </Button>
                </div>
      </header>)}