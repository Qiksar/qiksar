echo "Qiksar: pull the latest code from the Qiksar repo"
echo "The src folder will be copied from the qiksar folder into the app folder"
echo "The result is that files normally scaffolded by Qiksar will be updated in the app file structure."
echo "This means you don't have to regenerate your app everytime, in order to get the latest Qiksar features"

echo "Pull latest code to Qiksar folder..."
echo

cd ~/demo/qiksar
git pull

echo
echo "Copying code to test app folder..."
cp -R ~/demo/qiksar/app_template/src/* ~/demo/app/src
cd ~/demo
echo
echo "Done"