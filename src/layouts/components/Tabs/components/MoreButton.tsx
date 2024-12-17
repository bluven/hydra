import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { setTabsList } from "@/redux/modules/tabs";
import { RootState, useDispatch, useSelector } from "@/redux";
import { HOME_URL } from "@/config/config";

const MoreButton = (props: any) => {
	const dispatch = useDispatch();
	const { tabsList } = useSelector((state: RootState) => state.tabs);
	const { delTabs } = props;
	const { pathname } = useLocation();
	const navigate = useNavigate();

	// close multipleTab
	const closeMultipleTab = (tabPath?: string) => {
		const newTabsList = tabsList.filter((item: Menu.MenuOptions) => {
			return item.path === tabPath || item.path === HOME_URL;
		});
		dispatch(setTabsList(newTabsList));
		tabPath ?? navigate(HOME_URL);
	};

	const menu = (
		<Menu
			items={[
				{
					key: "1",
					label: <span>Close Current</span>,
					onClick: () => delTabs(pathname)
				},
				{
					key: "2",
					label: <span>Close Others</span>,
					onClick: () => closeMultipleTab(pathname)
				},
				{
					key: "3",
					label: <span>Close All</span>,
					onClick: () => closeMultipleTab()
				}
			]}
		/>
	);
	return (
		<Dropdown overlay={menu} placement="bottom" arrow={{ pointAtCenter: true }} trigger={["click"]}>
			<Button className="more-button" type="primary" size="small">
				More <DownOutlined />
			</Button>
		</Dropdown>
	);
};
export default MoreButton;
