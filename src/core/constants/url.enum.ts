export function UrlName(name: string): Object {
    return (
        {
            BeCustomerController: { vi: 'khách hàng', en: 'customer', screen: 'customer' },
            BeKeywordController: { vi: 'Từ khóa', en: 'keyword', screen: 'keyword' },
            BeMessageController: { vi: 'Lời chúc', en: 'message', screen: 'message' },
            BeSignalController: { vi: 'Thể loại', en: 'signal', screen: 'signal' },
            BeImageController: { vi: 'Hình ảnh', en: 'images', screen: 'images' },
            BeTitleController: { vi: 'Tiêu đề', en: 'title', screen: 'titles' },
            BePageController: { vi: 'Trang', en: 'page', screen: 'page' },
            RolesController: { vi: 'quyền', en: 'role', screen: 'role' },
            UserController: { vi: 'tài khoản', en: 'account', screen: 'auth' },
        }[name] || ''
    );
}
