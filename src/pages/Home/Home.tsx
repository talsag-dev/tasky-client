import { Box, Heading, Text, Card } from "@radix-ui/themes";

export const Home = () => {
  return (
    <Box p="4">
      <Heading size="7" mb="3">
        Welcome to Tasky 👋
      </Heading>

      <Text size="4" color="gray">
        Get started by opening the sidebar and selecting a section.
      </Text>

      <Card mt="4" variant="surface">
        <Text size="3">
          You can manage your tasks, view project boards, and more.
        </Text>
      </Card>
    </Box>
  );
};
