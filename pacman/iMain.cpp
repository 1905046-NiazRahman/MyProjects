# include "iGraphics.h"
#define swidth 1600
#define sheight 1080
#include<stdlib.h>
#include<iostream>
#include<queue>
using namespace std;
double cart_distance(pair<int,int> a, pair<int, int> b)
{
    return (double)sqrt((a.first - b.first)*(a.first - b.first) + (a.second - b.second)*(a.second - b.second));
}

int fol = 0;

struct gst
{
    int x, y,dx, dy, ori = 0;
} a, b, c, d, p;
void showscore();
void finish();

int arr[800][540];
int dx[] = {-1, 0, 1, 0};
int dy[] = {0, 1, 0, -1};
int toggle=2,ax=0,death=3,pause=-1;
int mult = 20, cnt = 0;
char ans[10];

int chase(int x, int y, int des, int desy);
void reset(void);
void reset2(void);
void maze(void);


int check(int x, int y)
{
    if(x < 30 || y < 30 || x >= 60 || y >= 60 || arr[x][y] == 1)
        return 0;
    return 1;

}
void ghostmove(gst* k, int x, int y)
{

    int bestx, besty, bestori;
    double dis, best = 100000;
    for(int i = 0; i < 4; i++)
        if(((i + 2)%4) != k->ori)
        {
            int nx = k->x + dx[i], ny = k->y + dy[i];
            if(!check(nx,ny))
                continue;
            dis = cart_distance({x, y}, {nx, ny});
            if(dis < best)
            {
                best = dis;
                bestx = nx, besty = ny,bestori = i;
            }
        }
    k->x = bestx, k->y = besty, k->ori = bestori;
}




void iDraw()
{

    iClear();
    if(toggle==2)
    {
        iClear();
        iShowBMP(200,20,"menu.bmp");
    }

    if(toggle==0)
    {
        iClear();
        sprintf(ans, "%d", cnt);

        if(death==3)
        {
            iClear();
            iSetColor(255,255,255);
            iText(870, 80, "LIFE=3", GLUT_BITMAP_TIMES_ROMAN_24);
            iText(870, 150, "SCORE", GLUT_BITMAP_TIMES_ROMAN_24);
            iText(900, 120, ans, GLUT_BITMAP_TIMES_ROMAN_24);
            maze();
        }
        if(death==2)
        {
            iClear();
            iSetColor(255,255,255);
            iText(870, 80, "LIFE=2", GLUT_BITMAP_TIMES_ROMAN_24);
            iText(870, 150, "SCORE", GLUT_BITMAP_TIMES_ROMAN_24);
            iText(900, 120, ans, GLUT_BITMAP_TIMES_ROMAN_24);
            maze();
        }
        if(death==1)
        {
            iClear();
            iSetColor(255,255,255);
            iText(870, 80, "LIFE=1", GLUT_BITMAP_TIMES_ROMAN_24);
            iText(870, 150, "SCORE", GLUT_BITMAP_TIMES_ROMAN_24);
            iText(900, 120, ans, GLUT_BITMAP_TIMES_ROMAN_24);
            maze();
        }



        iShowBMP2(1000,900,"pacpause.bmp", 000000);
        iShowBMP2(1000,950,"pacghost.bmp", 000000);
        iShowBMP2(1000,1000,"pacmenu2.bmp", 000000);
        finish();
    }



    if(toggle==1)
    {
        iClear();

        iShowBMP(300,200,"help.bmp");
        iSetColor(0,0,0);
        iText(700, 650, "YOUR SCORE", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(750, 600, ans, GLUT_BITMAP_TIMES_ROMAN_24);
        iText(650, 550, "THANKS FOR PLAYING.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(650, 500, "ENTER M FOR MAIN MENU.", GLUT_BITMAP_TIMES_ROMAN_24);


    }
    if(toggle==4)
    {
        iClear();
        iShowBMP(300,200,"help.bmp");
        iSetColor(0,0,0);
        iText(500, 750, "you have to avoid ghost and try to score.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 700, "press k for ghost chasing.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 650, "use arrow for moving pacman.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 600, "enter p for pause.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 550, "click resume to continue.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 500, "enter m for retuening to main menu.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 450, "you have three life.", GLUT_BITMAP_TIMES_ROMAN_24);
        iText(500, 400, "try your best.good luck.", GLUT_BITMAP_TIMES_ROMAN_24);


    }
    if(toggle==3)
    {
        iSetColor(0,0,0);
        iShowBMP(300,200,"help.bmp");
        showscore();
    }
}

int chk(int x, int y)
{
    if(x < 0 || x >= 800 || y < 0 || y >= 540 || arr[x][y] == 1)
        return 0;
    return  1;
}

void maze(void)
{
    for(int i = 30; i <= 60; i++)
        for(int j = 30; j <= 60; j++)
            if(arr[i][j] == 1)
            {
                iSetColor(100,100,0);
                iFilledRectangle(mult*i, mult*j - 400, mult, mult);
            }

            else if(arr[i][j] == 2)
            {
                continue;
            }
            else
            {
                iSetColor(10, 105,124);
                iFilledCircle(mult*i + 8, mult*j - 391, 5);
            }
    iSetColor(100,100,100);
    iFilledRectangle(p.x*mult, p.y*mult - 400, mult, mult);
    if(ax==1)
        iShowBMP2(p.x*mult, p.y*mult - 400,"pacmanright.bmp",000000);
    if(ax==0)
        iShowBMP2(p.x*mult, p.y*mult - 400,"pacmanleft.bmp",000000);
    if(ax==2)
        iShowBMP2(p.x*mult, p.y*mult - 400,"pacmanup.bmp",000000);
    if(ax==3)
        iShowBMP2(p.x*mult, p.y*mult - 400,"pacmandown.bmp",000000);

    iSetColor(255, 0, 0);
    iShowBMP2(a.x*mult, a.y* mult - 400, "ghost3.bmp", 000000);
    iSetColor(0, 0, 255);
    iShowBMP2(b.x*mult, b.y* mult - 400, "ghost2.bmp", 000000);
    iSetColor(0, 255, 0);
    iShowBMP2(c.x*mult, c.y* mult - 400, "ghost1.bmp", 000000);
    iSetColor(150, 150, 0);
    iShowBMP2(d.x*mult, d.y* mult - 400, "ghost4.bmp", 000000);
}
void iMouseMove(int mx, int my)
{

}

void iMouse(int button, int state, int mx, int my)
{
    if(button == GLUT_LEFT_BUTTON && state == GLUT_DOWN)
    {
        if ( mx>=396 && mx<=644 && my>=390 && my<=430 )
        {
            toggle=0;
            reset();
            if(pause==0)
                iResumeTimer(0);
        }
        else if ( mx>=396 && mx<=644 && my>=316 && my<=358 )
        {
            toggle=0,iResumeTimer(0);
        }
        else if ( mx>=396 && mx<=644 && my>=90  && my<=132 )
            exit(0);
        else if ( mx>=396 && mx<=644 && my>=239 && my<=283 )
            toggle=3;
        else if ( mx>=396 && mx<=644 && my>=165 && my<=208 )
            toggle=4;

        if(toggle==0)
        {
            if ( mx>=1000 && mx<=1200 && my>=900 && my<=938 )
            {
                iPauseTimer(0);
                toggle=2;
                pause=0;
            }
            if ( mx>=1000 && mx<=1200 && my>=950 && my<=988 )
            {
                fol = !fol;
            }
            if ( mx>=1000 && mx<=1200 && my>=1000 && my<=1038 )
            {
                toggle=2;
            }

        }
}


    if(button == GLUT_RIGHT_BUTTON && state == GLUT_DOWN)
    {
        //place your codes here
    }
}

void iKeyboard(unsigned char key)
{
    if(key == 'x')
    {

        exit(0);
    }
    if(key == 'k')
    {
        fol = !fol;
    }
    if(key == 'p')
    {
        iPauseTimer(0);
        toggle=2;
    }
    if(key == 'r')
    {
        iResumeTimer(0);
    }
    if(key == 'm'||key=='M')
    {
        toggle=2;
    }

}

void iSpecialKeyboard(unsigned char key)
{

    if(key == GLUT_KEY_END)
    {
        exit(0);
    }
    if(key == GLUT_KEY_LEFT)
    {
        if(chk(p.x+dx[0], p.y+dy[0]))
        {
            p.x+= dx[0], p.y+= dy[0], p.ori = 0;
            ax=0;
        }

    }
    if(key == GLUT_KEY_RIGHT)
    {
        if(chk(p.x+dx[2], p.y+dy[2]))
        {
            p.x+= dx[2], p.y+= dy[2], p.ori = 2;
            ax=1;
        }
    }
    if(key == GLUT_KEY_UP)
    {
        if(chk(p.x+dx[1], p.y+dy[1]))
        {
            p.x+= dx[1], p.y+= dy[1], p.ori = 1;
            ax=2;
        }
    }
    if(key == GLUT_KEY_DOWN)
    {
        if(chk(p.x+dx[3], p.y+dy[3]))
        {
            p.x+= dx[3], p.y+= dy[3], p.ori = 3;
            ax=3;
        }
    }
    if(arr[p.x][p.y] != 2)
        cnt++;
    arr[p.x][p.y] = 2;

}

void changemove()
{
    if(fol)
    {
        ghostmove(&a, p.x, p.y);
        ghostmove(&b, p.x+4*dx[p.ori], p.y + 4*dy[p.ori]);
        if(cart_distance({c.x, c.y}, {p.x, p.y}) < 8)
            ghostmove(&c, c.dx, c.dy);
        else
            ghostmove(&c, p.x, p.y);
        ghostmove(&d, a.y, a.x);
    }
    else
    {
        ghostmove(&a, a.dx, a.dy);
        ghostmove(&b, b.dx, b.dy);
        ghostmove(&c, c.dx, c.dy);
        ghostmove(&d, d.dx, d.dy);
    }
}

void wall()
{
    for(int i = 30; i <= 60; i++)
        arr[i][60] = arr[i][30] = arr[30][i] = arr[60][i] = 1;
    for(int i = 5; i <= 10; i++)
        arr[30+i][40] = arr[40][30+i] = arr[30+i][50] = arr[40][60-i]=1;

    for(int i = 0; i < 3; i++)
        arr[43+i][50] = arr[43+i][52] = arr[43+i][38] = arr[43+i][40]
                                        = arr[43][31+i] = arr[43][59-i] = arr[43+i][54] = arr[45][55+i] = arr[45][35-i] = arr[43+i][36]
                                                = arr[35 + i][33] = arr[37][34+i] = arr[31+i][37] = arr[31+i][53] = arr[37][56-i] = arr[35+i][57] = 1;

    for(int i = 30; i <= 45; i++)
        for(int j = 30; j < 60; j++)
            arr[90-i][j] = arr[i][j];

    arr[35][42]=arr[35][43]=arr[35][44]=arr[35][45]=arr[35][46]=arr[35][47]=arr[35][48]=1;
    arr[35][48]=arr[36][48]=arr[37][48]=arr[38][48]=arr[39][48]=1;
    arr[39][48]=arr[39][47]=arr[39][46]=arr[39][45]=arr[39][44]=arr[39][43]=arr[39][42]=1;
    arr[35][42]=arr[36][42]=arr[37][42]=arr[38][42]=arr[39][42]=1;
    arr[36][45]=arr[37][45]=arr[38][45]=1;

    arr[41][48]=arr[41][47]=arr[41][46]=arr[41][45]=arr[41][44]=arr[41][43]=arr[41][42]=1;
    arr[45][48]=arr[45][47]=arr[45][46]=arr[45][45]=arr[45][44]=arr[45][43]=arr[45][42]=1;
    arr[42][42]=arr[43][42]=arr[44][42]=arr[45][42]=1;

    arr[47][48]=arr[47][47]=arr[47][46]=arr[47][45]=arr[47][44]=arr[47][43]=arr[47][42]=1;
    arr[48][42]=arr[49][42]=arr[50][42]=1;
    arr[48][48]=arr[49][48]=arr[50][48]=1;
    arr[48][45]=arr[49][45]=arr[50][45]=1;

    arr[52][48]=arr[53][48]=arr[54][48]=arr[55][48]=1;
    arr[53][48]=arr[53][47]=arr[53][46]=arr[53][45]=arr[53][44]=arr[53][43]=arr[53][42]=1;
    arr[54][48]=arr[54][47]=arr[54][46]=arr[54][45]=arr[54][44]=arr[54][43]=arr[54][42]=1;
}
FILE *fp;
int highscore[10];
void finish()
{
    int s,k,i,j;
    fp=fopen("highscore.txt","r");

    for (i=0; i<10; i++)
        fscanf(fp,"%d\n",&highscore[i]);
    fclose(fp);
    if((p.x*mult==a.x*mult)&&(p.y*mult==a.y*mult)||(p.x*mult==b.x*mult)&&(p.y*mult==b.y*mult)||(p.x*mult==c.x*mult)&&(p.y*mult==c.y*mult)||(p.x*mult==d.x*mult)&&(p.y*mult==d.y*mult))
    {
        death--;
        reset2();
        if(death==0)
        {
            toggle=1;
            reset();
            if (cnt>highscore[9])
            {
                highscore[9]=cnt;
                for (i=0; i<9; i++)
                    for (j=i+1; j<10; j++)
                        if (highscore[j] > highscore[i])
                        {
                            s=highscore[i];
                            highscore[i]=highscore[j];
                            highscore[j]=s;
                        }
                fp=fopen("highscore.txt","w");
                for (k=0; k<10; k++)
                    fprintf(fp,"%d\n",highscore[k]);
                fclose(fp);
            }
        }
    }
}
void reset2(void)
{
    a.x = 31, a.dx = 31;
    a.y = 31, a.dy = 31;
    b.x = b.dx = 31;
    b.y = b.dy = 59;
    c.x = c.dx = 59;
    c.y = c.dy = 31;
    d.x = d.dx = 59;
    d.y = d.dy = 59;
    p.x = p.y = 43;
}
void reset(void)
{
    a.x = 31, a.dx = 31;
    a.y = 31, a.dy = 31;
    b.x = b.dx = 31;
    b.y = b.dy = 59;
    c.x = c.dx = 59;
    c.y = c.dy = 31;
    d.x = d.dx = 59;
    d.y = d.dy = 59;
    p.x = p.y = 43;
    death=3;
    cnt=0;
    ax=0;
    for(int i = 30; i <= 60; i++)
        for(int j = 30; j <= 60; j++)
            if(arr[i][j]==2)
                arr[i][j] = 0;


}


void showscore(void)
{
    fp=fopen("highscore.txt","r");

    for (int  i=0; i<10; i++)
        fscanf(fp,"%d\n",&highscore[i]);

    fclose(fp);
    iSetColor(0,0,0);
    iText(500,850,"TOP 10 SCORE",GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(1) %d", highscore[0]);
    iText(400,800,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(2) %d", highscore[1]);
    iText(400,750,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(3) %d", highscore[2]);
    iText(400,700,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(4) %d", highscore[3]);
    iText(400,650,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(5) %d", highscore[4]);
    iText(400,600,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(6) %d", highscore[5]);
    iText(400,550,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(7) %d", highscore[6]);
    iText(400,500,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(8) %d", highscore[7]);
    iText(400,450,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(9) %d", highscore[8]);
    iText(400,400,ans,GLUT_BITMAP_TIMES_ROMAN_24);
    sprintf(ans, "(10) %d", highscore[9]);
    iText(400,350,ans,GLUT_BITMAP_TIMES_ROMAN_24);
}

int main()
{
    wall();
    maze();
    iSetTimer(200, changemove);
    a.x = 31, a.dx = 31;
    a.y = 31, a.dy = 31;
    b.x = b.dx = 31;
    b.y = b.dy = 59;
    c.x = c.dx = 59;
    c.y = c.dy = 31;
    d.x = d.dx = 59;
    d.y = d.dy = 59;
    p.x = p.y = 43;


    iInitialize(swidth, sheight, "PacMan");

    arr[500][500] = 0;
    return 0;
}
