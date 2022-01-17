# Before code is committed to the Qiksar repo we copy the modified code to demo/app
# so that we can test the changes locally.

echo "Copy code from Qiksar DEV folder..."
echo

echo
echo "Copying code to test app folder..."
cp -R ~/dev/qiksar/app_template/src/* ~/demo/app/src
cd ~/demo/app
echo
echo "Done"