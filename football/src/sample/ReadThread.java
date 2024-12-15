package sample;

import javafx.application.Platform;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import java.util.SortedMap;

public class ReadThread implements Runnable,Serializable {
    public  Thread thr;
    public  Main main;

    public ReadThread(Main main) {
        this.main = main;
        this.thr = new Thread(this);
        thr.start();
    }

    public void run() {
        try {
            while (true) {
                Object o = main.getNetworkUtil().read();
                List<Players>temp=new ArrayList<>();
                String name=null;
                if (o != null) {
                    if(o instanceof List){
                        temp=(List<Players>)o;
                        main.playerLoad(temp);
                    }
                    if(o instanceof buyPlayer[]){
                        buyPlayer []bp=(buyPlayer[]) o;
                        main.buyLoad(bp);
                    }
                    if(o instanceof sellPlayer[]){
                        sellPlayer []sp=(sellPlayer[]) o;
                        main.sellLoad(sp);
                    }
                    if (o instanceof LoginDTO) {
                        LoginDTO loginDTO = (LoginDTO) o;
                        main.setclubname(loginDTO.getUserName());
                        Platform.runLater(new Runnable() {
                            @Override
                            public void run() {
                                if (loginDTO.isStatus()) {
                                    try {
                                        main.showHome();
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                } else {
                                    main.showAlert();
                                }

                            }
                        });
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            try {
                main.getNetworkUtil().closeConnection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}



