import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ){}

    createBoard(createBoardDto: CreateBoardDto, @GetUser() user: User): Promise <Board> {
        return this.boardRepository.createBoard(createBoardDto, user);
    }


    async getBoardById(id:number): Promise <Board> {
        const found = await this.boardRepository.findOne(id);

        if(!found) {
            throw new NotFoundException("Can't find Board with id " + id);
        }
        
        return found;
    }

    async deleteBoard(id: number, user: User) :Promise <void> {
        const result = await this.boardRepository.delete({id, user});

        if(result.affected === 0) {
            throw new NotFoundException("Can't find Board with id " + id)
        }
    }

    async updateBoardStatus(id: number, status:BoardStatus) : Promise <Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

    async getAllBoards(
        user: User
    ) : Promise <Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', {userId: user.id})

        const boards = await query.getMany();

        return boards;
    }

    



    /*
    로컬에 저장할때 사용하던 코드

    getAllBoards(): Board[] {
        return this.boards;
    }

    createBoard(createBoardDto: CreateBoardDto) {
        const {title, description} = createBoardDto;

        const board: Board = {
            id: uuid(), // id 값을 유니크한 값으로 가져오는 모듈
            title,
            description,
            status: BoardStatus.PUBLIC
        }

        this.boards.push(board);
        return board;
    }


    
    getBoardById(id: string): Board {
        const found = this.boards.find((board) => board.id === id);

        if(!found) {
            throw new NotFoundException("Can't find Board with id " + id); // 에러 문구 표시 (throw new NotFoundException('원하는 문구'))
        }

        return found;
    }

    
    deleteBoard(id: string): void { // void 결과값 반환 안할때 사용
        const found = this.getBoardById(id);
        this.boards = this.boards.filter((board) => board.id !== found.id);
    }

    updateBoardStatus(id: string, status: BoardStatus): Board {
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }
    */
}
