import random

def number_game():
    number = random.randint(1, 100)
    tries = 0
    
    print("1부터 100 사이의 숫자를 맞춰보세요!")
    
    while True:
        tries += 1
        guess = int(input("숫자를 입력하세요: "))
        
        if guess < number:
            print("더 큰 숫자입니다!")
        elif guess > number:
            print("더 작은 숫자입니다!")
        else:
            print(f"정답입니다! {tries}번 만에 맞추셨네요!")
            break

if __name__ == "__main__":
    number_game()