import { Card, CardImg, CardBody, CardTitle, CardText, Button } from "react-bootstrap";

export default function BootstrapCards() {
  return (
    <div id="wd-css-navigating-with-cards">
      <h2>Cards</h2>
      <Card style={{ width: "18rem" }}>
        <CardImg variant="top" src="/Images/stacked.jpg" />
        <CardBody>
          <CardTitle>Stacking Starship</CardTitle>
          <CardText>
            Stacking the most powerful rocket in history. Mars or bust!
          </CardText>
          <Button variant="primary">Boldly Go</Button>
        </CardBody>
      </Card>
    </div>
  );
}
