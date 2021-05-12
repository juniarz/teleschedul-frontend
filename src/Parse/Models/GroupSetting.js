import Parse from 'parse';

class GroupSetting extends Parse.Object {
    constructor() {
        super('GroupSetting');
    }

    static async get(chatId) {
        const query = new Parse.Query(GroupSetting);
        query.equalTo("chatId", chatId);

        const result = await query.first();

        if (result) {
            return await result.fetch();
        }

        const setting = new GroupSetting();

        setting.set({
            chatId,
            enabled: false,
            frequency: 5
        });

        setting.setACL(new Parse.ACL(Parse.User.current()));
        setting.save();

        return setting;
    }
}

export default GroupSetting;

Parse.Object.registerSubclass('GroupSetting', GroupSetting);