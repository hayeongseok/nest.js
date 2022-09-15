import { Board } from "./board.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatus } from "./board-status.enum";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
    async createBoard(createBoardDto: CreateBoardDto, @GetUser() user: User): Promise <Board> {
        const {title, description } = createBoardDto;

        const board = this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        })

        await this.save(board);
        return board;
    }
}