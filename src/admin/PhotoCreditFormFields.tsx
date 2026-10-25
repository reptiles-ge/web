import { Checkbox, Col, Form, Input, Row } from "antd";

export function PhotoCreditFormFields() {
  return (
    <>
      <Row gutter={12} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Form.Item label="Photographer (Georgian)" name="photographer">
            <Input maxLength={200} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Photographer (English)" name="photographerEn">
            <Input maxLength={200} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Place (Georgian)" name="location">
            <Input maxLength={300} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Place (English)" name="locationEn">
            <Input maxLength={300} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Date" name="date">
            <Input maxLength={40} placeholder="2026-05-10" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Latitude" name="lat">
            <Input maxLength={40} placeholder="41.81667" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Longitude" name="lng">
            <Input maxLength={40} placeholder="45.35" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Source link" name="url">
            <Input maxLength={500} placeholder="https://" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="georgiaField" valuePropName="checked">
        <Checkbox>Taken in Georgia (needs a place)</Checkbox>
      </Form.Item>
    </>
  );
}
