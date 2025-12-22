module ApplicationHelper

 def destroy_admin_user_session_path
    session[:current_admin] = nil
    return "/"
  end

end
