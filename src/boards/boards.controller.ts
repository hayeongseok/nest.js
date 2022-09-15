import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
// 인증 미들웨어
@UseGuards(AuthGuard())
export class BoardsController {
    // logger 객체 생성
    private logger = new Logger('BoardController')
    constructor(private boardsService: BoardsService) {}

    @Get()
    getAllBoard(
        @GetUser() user:User
    ): Promise <Board[]> {
        this.logger.verbose('User ' + user.username + ' trying to get all boards');
        return this.boardsService.getAllBoards(user);
    }

    @Get('/:id')
    getBoardById(@Param('id') id:number) : Promise <Board> {
        return this.boardsService.getBoardById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() CreateBoardDto: CreateBoardDto, 
    @GetUser() user: User): Promise <Board> {
        // {Object Object} 나오기 때문에 JSON.stringify() string으로 만들어줌.
        this.logger.verbose('User ' + user.username + ' creating a new board. Payload: ' + JSON.stringify(CreateBoardDto)); 
        return this.boardsService.createBoard(CreateBoardDto, user);
    }

    @Delete('/:id')
    // ParseIntPipe 파라미터가 숫자로 오는지 확인하는 Pipe
    deleteBoard(@Param('id', ParseIntPipe) id, 
    @GetUser() user:User
    ): Promise <void> {
        return this.boardsService.deleteBoard(id, user);
    }

    @Patch('/:id/status')
    updateBardStatus(
        // ParseIntPipe 파라미터가 숫자로 오는지 확인하는 Pipe
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }

    
    


    /*
    로컬에 저장할때 사용하던 코드
    @Get()
    getAllBoard(): Board[] {
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe) // pipe
    createBoard(
        @Body() createBoardDto: CreateBoardDto
    ): Board {
        return this.boardsService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(@Param('id') id:string) : Board {
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id') id: string) : void {
        this.boardsService.deleteBoard(id);
    }
    
    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id') id: string,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus // 파이프를 통해 유효성 검사 실행
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }
    */
}
