import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TriviumGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide d'utilisation de la démonstration Trivium</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="intro">
            <AccordionTrigger>Introduction</AccordionTrigger>
            <AccordionContent>
              <p>Cette section présente les concepts de base de Trivium. Lisez attentivement pour comprendre le contexte du chiffrement.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="keygen">
            <AccordionTrigger>Génération de clé</AccordionTrigger>
            <AccordionContent>
              <p>Utilisez cette section pour générer une paire clé-IV. Vous pouvez saisir manuellement ou utiliser la fonction de génération automatique.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="encrypt">
            <AccordionTrigger>Chiffrement</AccordionTrigger>
            <AccordionContent>
              <p>Entrez un texte clair et utilisez la clé générée pour le chiffrer. Observez le texte chiffré résultant.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="decrypt">
            <AccordionTrigger>Déchiffrement</AccordionTrigger>
            <AccordionContent>
              <p>Utilisez cette section pour déchiffrer le texte chiffré. Vérifiez que le texte clair original est correctement récupéré.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="visualize">
            <AccordionTrigger>Visualisation</AccordionTrigger>
            <AccordionContent>
              <p>Cette section offre une représentation visuelle de l'état interne de Trivium. Observez comment il évolue au fil du temps.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="analyze">
            <AccordionTrigger>Analyse</AccordionTrigger>
            <AccordionContent>
              <p>Examinez l'analyse de sécurité de Trivium. Réfléchissez aux forces et aux potentielles faiblesses du chiffrement.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="performance">
            <AccordionTrigger>Performance</AccordionTrigger>
            <AccordionContent>
              <p>Testez les performances de Trivium avec différentes tailles d'entrée. Comparez les temps de chiffrement et de déchiffrement.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

