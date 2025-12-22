require 'test_helper'

class InfoItemsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get info_items_new_url
    assert_response :success
  end

  test "should get create" do
    get info_items_create_url
    assert_response :success
  end

end
