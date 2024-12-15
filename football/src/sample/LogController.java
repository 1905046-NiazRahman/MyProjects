package sample;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

public class LogController {
    Main main;
    @FXML
    private TextField club;
    @FXML
    private PasswordField pass;
    @FXML
    private Button login;
    @FXML
    private Button exit;
    @FXML
    public void loginAction(ActionEvent event)throws Exception{
        String userclub=club.getText();
        String password = pass.getText();
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUserName(userclub);
        loginDTO.setPassword(password);
        try {
            main.getNetworkUtil().write(loginDTO);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    @FXML
    public void ExitAction(ActionEvent event)throws Exception{
        main.exit();
    }

    void setMain(Main main) {
        this.main = main;
    }
}
