import React from 'react';
import { Accordion, Card, ListGroup, Tab, Tabs } from 'react-bootstrap';

const AboutUsPage = () => {
  return (
    <Tabs defaultActiveKey="location" className="mt-3">
      <Tab eventKey="location" title="Locația">
      <iframe
        title="Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.290790685666!2d28.843377315606313!3d47.01150182296877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d3cbb6c7b1e733%3A0x2215d5a5fa5a369f!2sUniversitatea%20de%20Stat%20din%20Moldova!5e0!3m2!1sen!2sro!4v1645512367346!5m2!1sen!2sro"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        />
        <p className="mt-3">
          <strong>Adresa:</strong> str. Alexei Mateevici 60, Chișinău, Republica Moldova
        </p>
      </Tab>

      <Tab eventKey="contact" title="Informații de contact">
        <Card className="mt-3">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Telefon:</strong> 55-55-55
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Fax:</strong> 55-55-55
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Adresa:</strong> str. Alexei Mateevici 60, Chișinău
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Tab>

      <Tab eventKey="schedule" title="Programare">
        <Accordion className="mt-3">
          <Accordion.Item eventKey='1'>
            <Accordion.Header >
              <strong>Luni-Vineri</strong> - 9.00-17.00
            </Accordion.Header>
            <Accordion.Body>
              Suntem deschisi de luni pana vineri, intre orele 9 dimineata si 5 dupa-amiaza.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='2'>
            <Accordion.Header >
              <strong>Sâmbăta și duminica </strong> - suntem închisi.
            </Accordion.Header>
            <Accordion.Body>
              Suntem închisi în weekend-uri.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Tab>
    </Tabs>
  );
};

export default AboutUsPage;

