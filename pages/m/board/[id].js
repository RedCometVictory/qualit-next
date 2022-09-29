import BoardLayout from "@/components/layouts/BoardLayout";

const Board = () => {
  return (
    <div>Board</div>
  )
};
export default Board;
Board.getLayout = function getLayout(Board) {
  return <BoardLayout>{Board}</BoardLayout>
};