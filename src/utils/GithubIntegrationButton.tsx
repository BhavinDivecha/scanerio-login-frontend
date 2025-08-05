import { Button } from '@/components/ui/button'
// import { Github } from 'lucide-react'
import React from 'react'
import { FiGithub } from 'react-icons/fi'

interface GithubIntegrationButtonProps {
  title: string
}
const GithubIntegrationButton:React.FC<GithubIntegrationButtonProps> = ({title}) => {
  return (
    <Button><FiGithub />{title} </Button>
  )
}

export default GithubIntegrationButton