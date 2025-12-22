ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { 'Create Schedule' }

  content title: proc { "Create Schedule" } do
    div class: "blank_slate_container", id: "dashboard_default_message" do
      span class: "blank_slate" do
        link_to new_training_session_path do
          'Create training session'
        end
      end
    end
  end # content
  # content title: proc { "Create Schedule" } do
  #   div class: "blank_slate_container", id: "dashboard_default_message_2" do
  #     span class: "blank_slate" do
  #       link_to new_info_item_path do
  #         'Create Info Item'
  #       end
  #     end
  #   end
  # end

  # Here is an example of a simple dashboard with columns and panels.
  #
  # columns do
  #   column do
  #     panel "Recent Posts" do
  #       ul do
  #         Post.recent(5).map do |post|
  #           li link_to(post.title, admin_post_path(post))
  #         end
  #       end
  #     end
  #   end

  #   column do
  #     panel "Info" do
  #       para "Welcome to ActiveAdmin."
  #     end
  #   end
  # end
end
