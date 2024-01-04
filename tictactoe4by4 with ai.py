import random

def print_board(board):
    for row in board:
        print(" | ".join(row))
        print("-" * 7)

def is_winner(board, player):
    # Check rows, columns, and diagonals
    for i in range(4):
        if all(board[i][j] == player for j in range(4)) or all(board[j][i] == player for j in range(4)):
            return True
    if all(board[i][i] == player for i in range(4)) or all(board[i][3 - i] == player for i in range(4)):
        return True
    return False

def is_board_full(board):
    return all(board[i][j] != ' ' for i in range(4) for j in range(4))

def get_empty_cells(board):
    return [(i, j) for i in range(4) for j in range(4) if board[i][j] == ' ']

def minimax(board, depth, is_maximizing):
    if is_winner(board, 'O'):
        return -1
    if is_winner(board, 'X'):
        return 1
    if is_board_full(board):
        return 0

    if is_maximizing:
        max_eval = float('-inf')
        for i, j in get_empty_cells(board):
            board[i][j] = 'X'
            eval = minimax(board, depth + 1, False)
            board[i][j] = ' '
            max_eval = max(max_eval, eval)
        return max_eval
    else:
        min_eval = float('inf')
        for i, j in get_empty_cells(board):
            board[i][j] = 'O'
            eval = minimax(board, depth + 1, True)
            board[i][j] = ' '
            min_eval = min(min_eval, eval)
        return min_eval

def best_move(board):
    best_val = float('-inf')
    best_move = (-1, -1)
    for i, j in get_empty_cells(board):
        board[i][j] = 'X'
        move_val = minimax(board, 0, False)
        board[i][j] = ' '
        if move_val > best_val:
            best_move = (i, j)
            best_val = move_val
    return best_move

def play_game():
    board = [[' ' for _ in range(4)] for _ in range(4)]
    while True:
        print_board(board)
        row = int(input("Enter row (0, 1, 2, or 3): "))
        col = int(input("Enter column (0, 1, 2, or 3): "))
        
        # Player move
        if board[row][col] == ' ':
            board[row][col] = 'O'
        else:
            print("Cell already occupied. Try again.")
            continue

        if is_winner(board, 'O'):
            print_board(board)
            print("Congratulations! You win!")
            break

        if is_board_full(board):
            print_board(board)
            print("It's a tie!")
            break

        # AI move
        print("AI is making a move...")
        ai_row, ai_col = best_move(board)
        board[ai_row][ai_col] = 'X'

        if is_winner(board, 'X'):
            print_board(board)
            print("AI wins! Better luck next time.")
            break

        if is_board_full(board):
            print_board(board)
            print("It's a tie!")
            break

if __name__ == "__main__":
    play_game()
