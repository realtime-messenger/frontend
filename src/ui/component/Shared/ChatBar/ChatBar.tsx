import SearchBar from "../SearchBar/SearchBar.tsx";
import {ChatEntry, ChatList, UserEntry, UserList} from "../List/List.tsx";
import classes from "./ChatBar.module.css"
import {FC, useEffect, useState} from "react";
import {useFetching} from "../../../../hooks/useFetching.ts";
import {UserResponse} from "../../../../types/schemas/user.ts";
import {getUsers} from "../../../../api/routes/user.ts";
import {ChatResponse} from "../../../../types/schemas/chat.ts";
import {MessageExtendedResponse} from "../../../../types/schemas/message.ts";

interface ChatBarProps {
	messages: MessageExtendedResponse[]
	chats: ChatResponse[]
	onUserChoose: (value: UserResponse) => void
	onChatChoose: (value: ChatResponse) => void
}

const ChatBar: FC<ChatBarProps> = (
	{
		messages,
		chats,
		onUserChoose,
		onChatChoose
	}
) => {

	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [searchPrompt, setSearchPrompt] = useState<string>("");

	const [users, setUsers] = useState<UserResponse[]>([]);

	const [fetchUsers, isUsersLoading, usersError, resetUsersError] = useFetching(async (query: string) => {
			const fetchedUsers: UserResponse[] = await getUsers(query);
			setUsers([...fetchedUsers])
		}
	)

	useEffect(() => {
		if (!isSearching) {
			setUsers([])
			return
		}
		if (searchPrompt === "") {
			setUsers([])
			return;
		}
		fetchUsers(searchPrompt).then()

	}, [isSearching, searchPrompt]);


	const getLastMessage = (chatId: number) => {
		messages.forEach(
			(message: MessageExtendedResponse) => {
				if (message.chatId === chatId) {
					return message
				}
			}
		)
		return null;
	}



	return (
		<div className={classes.chatBar}>
			<SearchBar
				setIsSearching={(value) => setIsSearching(value)}
				searchPrompt={searchPrompt}
				setSearchPrompt={(value) => setSearchPrompt(value)}
			></SearchBar>
			{
				!isSearching ? (
					<ChatList>
						{
							chats.map(
								(chat: ChatResponse) => (
									<ChatEntry
										onClick={
											() => {
												onChatChoose(chat)
											}
										}
										id={chat.id}
										type={chat.type}
										title={chat.title}
										interlocutor={chat.interlocutor}
										dateCreated={chat.dateCreated}
										lastMessage={getLastMessage(chat.id)}
									>
									</ChatEntry>
								)
							)
						}
					</ChatList>
				) :
				(
					<UserList>
						{
							users.map(
								(user: UserResponse) => (
									<UserEntry
										onClick={
											() => {
												onUserChoose(user)
												setSearchPrompt("")
												setIsSearching(false)
											}
										}
										firstName={user.firstName}
										lastName={user.lastName}
									>
									</UserEntry>
								)
							)
						}
					</UserList>
				)
			}
		</div>
	);
};

export default ChatBar;