import {
  Box,
  Heading,
  Button,
  Flex,
  Text,
  Separator,
  Card,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

const mockTasks = [
  { id: 1, title: "Finish frontend layout", status: "In Progress" },
  { id: 2, title: "Write API docs", status: "Pending" },
  { id: 3, title: "Push latest commits", status: "Completed" },
];

export const TasksPage = () => {
  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="3">
        <Heading size="6">Your Tasks</Heading>
        <Button size="2" variant="solid">
          <PlusIcon /> Create Task
        </Button>
      </Flex>

      <Separator my="3" />

      <Flex direction="column" gap="3">
        {mockTasks.map((task) => (
          <Card key={task.id} variant="classic">
            <Flex justify="between" align="center">
              <Text size="4">{task.title}</Text>
              <Text size="2" color="gray">
                {task.status}
              </Text>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};
