import { Checkbox, Col, Form, Input, Row, Typography } from "antd";

export function PhotoCreditFormFields({
  prefix = [],
  profileName = "",
}: {
  prefix?: string[];
  profileName?: string;
}) {
  return (
    <>
      <Row gutter={12} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Form.Item
            extra={
              profileName ? (
                <>
                  iNaturalist profile name:{" "}
                  <Typography.Text copyable strong>
                    {profileName}
                  </Typography.Text>
                </>
              ) : undefined
            }
            label="Photographer (Georgian)"
            name={[...prefix, "photographer"]}
          >
            <Input maxLength={200} name="photographer" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Photographer (English)"
            name={[...prefix, "photographerEn"]}
          >
            <Input maxLength={200} name="photographerEn" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Place (Georgian)" name={[...prefix, "location"]}>
            <Input maxLength={300} name="location" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Place (English)" name={[...prefix, "locationEn"]}>
            <Input maxLength={300} name="locationEn" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Date" name={[...prefix, "date"]}>
            <Input maxLength={40} name="date" placeholder="2026-05-10" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Latitude" name={[...prefix, "lat"]}>
            <Input maxLength={40} name="lat" placeholder="41.81667" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Longitude" name={[...prefix, "lng"]}>
            <Input maxLength={40} name="lng" placeholder="45.35" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Source link" name={[...prefix, "url"]}>
            <Input maxLength={500} name="url" placeholder="https://" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name={[...prefix, "georgiaField"]} valuePropName="checked">
        <Checkbox>Taken in Georgia (needs a place)</Checkbox>
      </Form.Item>
    </>
  );
}
