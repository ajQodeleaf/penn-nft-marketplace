import { Flex } from "@chakra-ui/react";
import RankingListItemCard from "./RankingListItemCard";

const RankingList = ({ rankings }) => {
  return (
    <Flex direction="column" gap="28px" mb="36px">
      {rankings.map((listItem, index) => (
        <RankingListItemCard key={index} index={index} listItem={listItem} />
      ))}
    </Flex>
  );
};

export default RankingList;
